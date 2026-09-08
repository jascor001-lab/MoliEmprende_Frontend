import { NextResponse } from "next/server";
import { llamarBackend, respuestaDeError } from "@/lib/api/backend";
import type { MenuPanel } from "@/lib/admin/types";

export async function GET() {
  const resultado = await llamarBackend<{ menus: MenuPanel[] }>("/menus/mios");

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json({ menus: resultado.datos.menus });
}
