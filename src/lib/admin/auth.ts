import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "moliemprende_admin";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "moliemprende-dev-secret-change-me"
  );
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createAdminToken(): string {
  const exp = Date.now() + MAX_AGE_MS;
  const payload = `admin:${exp}`;
  return `${exp}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = sign(`admin:${exp}`);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function validateAdminCredentials(
  username: string,
  password: string
): boolean {
  const creds = getAdminCredentials();
  return username === creds.username && password === creds.password;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = cookies();
  return verifyAdminToken(jar.get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME, MAX_AGE_MS };
