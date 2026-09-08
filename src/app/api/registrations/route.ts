import { NextResponse } from "next/server";
import { llamarBackend, respuestaDeError } from "@/lib/api/backend";
import { aRegistroApi, aRegistroPanel } from "@/lib/registrations/mapeo";
import type { RegistrationRecord } from "@/lib/registrations/types";

export async function POST(request: Request) {
  let cuerpo: RegistrationRecord;
  try {
    cuerpo = (await request.json()) as RegistrationRecord;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const resultado = await llamarBackend<{ registro: Record<string, unknown> }>(
    "/registros",
    { metodo: "POST", cuerpo: aRegistroApi(cuerpo), conSesion: false }
  );

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);

  return NextResponse.json(
    { ok: true, record: aRegistroPanel(resultado.datos.registro) },
    { status: 201 }
  );
}
