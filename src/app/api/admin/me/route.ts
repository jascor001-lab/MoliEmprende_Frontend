import { NextResponse } from "next/server";
import { llamarBackend, respuestaDeError } from "@/lib/api/backend";
import type { UsuarioPanel } from "@/lib/admin/types";

export async function GET() {
  const resultado = await llamarBackend<{ usuario: UsuarioPanel }>(
    "/autenticacion/perfil"
  );

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json({ usuario: resultado.datos.usuario });
}
