import { NextResponse } from "next/server";
import { llamarBackend, respuestaDeError } from "@/lib/api/backend";
import type { RolPanel } from "@/lib/admin/types";

export async function GET() {
  const resultado = await llamarBackend<{ roles: RolPanel[] }>("/roles");

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json({ roles: resultado.datos.roles });
}
