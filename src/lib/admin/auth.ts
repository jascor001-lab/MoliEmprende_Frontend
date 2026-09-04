import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { PanelRole, PublicPanelUser } from "@/lib/admin/types";
import { findUserById } from "@/lib/admin/users";

const COOKIE_NAME = "moliemprende_admin";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface SessionPayload {
  userId: string;
  role: PanelRole;
  username: string;
  exp: number;
}

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "moliemprende-dev-secret-change-me"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(user: {
  id: string;
  role: PanelRole;
  username: string;
}): string {
  const exp = Date.now() + MAX_AGE_MS;
  const body = `${user.id}|${user.role}|${user.username}|${exp}`;
  return `${body}.${sign(body)}`;
}

export function parseSessionToken(
  token: string | undefined
): SessionPayload | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return null;

  const body = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = sign(body);

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  const [userId, role, username, expStr] = body.split("|");
  const exp = Number(expStr);
  if (!userId || !username || (role !== "admin" && role !== "user")) return null;
  if (!Number.isFinite(exp) || Date.now() > exp) return null;

  return { userId, role, username, exp };
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = cookies();
  return parseSessionToken(jar.get(COOKIE_NAME)?.value);
}

export async function requireAuth(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user || !user.active) return null;
  if (user.role !== session.role) return null;

  return {
    userId: user.id,
    role: user.role,
    username: user.username,
    exp: session.exp,
  };
}

export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await requireAuth();
  if (!session || session.role !== "admin") return null;
  return session;
}

/** @deprecated usar requireAuth */
export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await requireAuth());
}

export async function getCurrentPublicUser(): Promise<PublicPanelUser | null> {
  const session = await requireAuth();
  if (!session) return null;
  const user = await findUserById(session.userId);
  if (!user || !user.active) return null;
  const { passwordHash: _, ...pub } = user;
  return pub;
}

export { COOKIE_NAME, MAX_AGE_MS };
