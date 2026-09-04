import { promises as fs } from "fs";
import path from "path";
import type { RegistrationRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "registrations.json");

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, "[]", "utf-8");
  }
}

export async function readRegistrations(): Promise<RegistrationRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(STORE_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as RegistrationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeRegistrations(records: RegistrationRecord[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(STORE_FILE, JSON.stringify(records, null, 2), "utf-8");
}

/** Upsert por DNI: actualiza si ya existe, si no crea. */
export async function upsertRegistration(
  incoming: RegistrationRecord
): Promise<RegistrationRecord> {
  const records = await readRegistrations();
  const dni = incoming.dni.trim();
  const index = records.findIndex((r) => r.dni.trim() === dni);

  if (index >= 0) {
    const prev = records[index];
    const updated: RegistrationRecord = {
      ...prev,
      ...incoming,
      id: prev.id,
      createdAt: prev.createdAt,
      updatedAt: new Date().toISOString(),
    };
    records[index] = updated;
    await writeRegistrations(records);
    return updated;
  }

  const created = {
    ...incoming,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  records.push(created);
  await writeRegistrations(records);
  return created;
}
