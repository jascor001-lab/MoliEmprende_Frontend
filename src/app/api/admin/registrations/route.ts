import { NextResponse } from "next/server";
import { llamarBackend, respuestaDeError } from "@/lib/api/backend";
import { aRegistroPanel } from "@/lib/registrations/mapeo";

export async function GET() {
  const resultado = await llamarBackend<{ registros: Record<string, unknown>[] }>(
    "/registros"
  );

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);

  const records = resultado.datos.registros.map(aRegistroPanel);
  return NextResponse.json({ records, total: records.length });
}
