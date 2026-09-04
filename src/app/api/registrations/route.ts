import { NextResponse } from "next/server";
import { upsertRegistration, readRegistrations } from "@/lib/registrations/store";
import type { RegistrationRecord } from "@/lib/registrations/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegistrationRecord;

    if (!body.dni || !/^\d{8}$/.test(String(body.dni).trim())) {
      return NextResponse.json(
        { error: "DNI inválido (8 dígitos)" },
        { status: 400 }
      );
    }
    if (!body.fullName?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Nombre y correo son obligatorios" },
        { status: 400 }
      );
    }
    if (!body.mainGroup || !body.subClassification) {
      return NextResponse.json(
        { error: "Falta clasificación del perfil" },
        { status: 400 }
      );
    }

    const saved = await upsertRegistration({
      ...body,
      id: body.id || crypto.randomUUID(),
      dni: String(body.dni).trim(),
    });

    return NextResponse.json({ ok: true, record: saved }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar el registro" },
      { status: 500 }
    );
  }
}

/** Solo para health/debug en desarrollo */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible" }, { status: 404 });
  }
  const records = await readRegistrations();
  return NextResponse.json({ count: records.length });
}
