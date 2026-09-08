import { NextResponse } from "next/server";
import { llamarBackend, respuestaDeError } from "@/lib/api/backend";

export interface EstadisticasPanel {
  totalEnvios: number;
  totalPersonas: number;
  emprendedores: number;
  artesanos: number;
}

export async function GET() {
  const resultado = await llamarBackend<EstadisticasPanel>("/registros/estadisticas");

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json(resultado.datos);
}
