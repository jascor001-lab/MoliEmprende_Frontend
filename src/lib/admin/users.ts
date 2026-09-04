import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { PanelRole, PanelUser, PublicPanelUser } from "@/lib/admin/types";

export type { PanelRole, PanelUser, PublicPanelUser } from "@/lib/admin/types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf-8");
  }
}

export function hashPassword(password: string, salt?: string): string {
  const usedSalt = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, usedSalt, 64).toString("hex");
  return `${usedSalt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function toPublic(user: PanelUser): PublicPanelUser {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

async function readUsersRaw(): Promise<PanelUser[]> {
  await ensureStore();
  const raw = await fs.readFile(USERS_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as PanelUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: PanelUser[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

/** Garantiza que exista el admin bootstrap desde .env */
export async function ensureBootstrapAdmin(): Promise<void> {
  const users = await readUsersRaw();
  const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = users.find((u) => u.username === username);
  if (existing) {
    if (existing.role !== "admin" || !existing.active) {
      existing.role = "admin";
      existing.active = true;
      await writeUsers(users);
    }
    return;
  }

  users.push({
    id: createHash("sha256").update(`bootstrap:${username}`).digest("hex").slice(0, 32),
    username,
    passwordHash: hashPassword(password),
    role: "admin",
    fullName: "Administrador",
    createdAt: new Date().toISOString(),
    active: true,
  });
  await writeUsers(users);
}

export async function listUsers(): Promise<PublicPanelUser[]> {
  await ensureBootstrapAdmin();
  const users = await readUsersRaw();
  return users.map(toPublic).sort((a, b) => a.username.localeCompare(b.username));
}

export async function findUserByUsername(
  username: string
): Promise<PanelUser | null> {
  await ensureBootstrapAdmin();
  const users = await readUsersRaw();
  return (
    users.find((u) => u.username === username.trim().toLowerCase()) ?? null
  );
}

export async function findUserById(id: string): Promise<PanelUser | null> {
  await ensureBootstrapAdmin();
  const users = await readUsersRaw();
  return users.find((u) => u.id === id) ?? null;
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<PublicPanelUser | null> {
  const user = await findUserByUsername(username);
  if (!user || !user.active) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return toPublic(user);
}

export async function createUser(input: {
  username: string;
  password: string;
  role: PanelRole;
  fullName: string;
}): Promise<PublicPanelUser> {
  await ensureBootstrapAdmin();
  const users = await readUsersRaw();
  const username = input.username.trim().toLowerCase();

  if (!username || username.length < 3) {
    throw new Error("El usuario debe tener al menos 3 caracteres");
  }
  if (!input.password || input.password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
  if (input.role !== "admin" && input.role !== "user") {
    throw new Error("Rol inválido");
  }
  if (users.some((u) => u.username === username)) {
    throw new Error("Ese nombre de usuario ya existe");
  }

  const user: PanelUser = {
    id: randomBytes(16).toString("hex"),
    username,
    passwordHash: hashPassword(input.password),
    role: input.role,
    fullName: input.fullName.trim() || username,
    createdAt: new Date().toISOString(),
    active: true,
  };

  users.push(user);
  await writeUsers(users);
  return toPublic(user);
}

export async function deleteUser(id: string, actorId: string): Promise<void> {
  await ensureBootstrapAdmin();
  const users = await readUsersRaw();
  const target = users.find((u) => u.id === id);
  if (!target) throw new Error("Usuario no encontrado");
  if (target.id === actorId) throw new Error("No puedes eliminar tu propia cuenta");

  const admins = users.filter((u) => u.role === "admin" && u.active);
  if (target.role === "admin" && admins.length <= 1) {
    throw new Error("Debe existir al menos un administrador");
  }

  await writeUsers(users.filter((u) => u.id !== id));
}

export async function setUserActive(
  id: string,
  active: boolean,
  actorId: string
): Promise<PublicPanelUser> {
  await ensureBootstrapAdmin();
  const users = await readUsersRaw();
  const target = users.find((u) => u.id === id);
  if (!target) throw new Error("Usuario no encontrado");
  if (target.id === actorId && !active) {
    throw new Error("No puedes desactivar tu propia cuenta");
  }

  if (!active && target.role === "admin") {
    const otherAdmins = users.filter(
      (u) => u.role === "admin" && u.active && u.id !== id
    );
    if (otherAdmins.length === 0) {
      throw new Error("Debe existir al menos un administrador activo");
    }
  }

  target.active = active;
  await writeUsers(users);
  return toPublic(target);
}
