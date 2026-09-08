import { NextResponse } from "next/server";
import { llamarBackend, respuestaDeError } from "@/lib/api/backend";
import type { UsuarioPanel } from "@/lib/admin/types";

export async function GET() {
  const resultado = await llamarBackend<{ usuarios: UsuarioPanel[] }>("/usuarios");

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json({ usuarios: resultado.datos.usuarios });
}

export async function POST(request: Request) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const resultado = await llamarBackend<{ usuario: UsuarioPanel }>("/usuarios", {
    metodo: "POST",
    cuerpo,
  });

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json({ ok: true, usuario: resultado.datos.usuario }, { status: 201 });
}

/** Sirve tanto para editar los datos como para activar o desactivar la cuenta. */
export async function PATCH(request: Request) {
  let cuerpo: Record<string, unknown> & { id?: string };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const { id, ...cambios } = cuerpo;
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const resultado = await llamarBackend<{ usuario: UsuarioPanel }>(
    `/usuarios/${encodeURIComponent(id)}`,
    { metodo: "PATCH", cuerpo: cambios }
  );

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json({ ok: true, usuario: resultado.datos.usuario });
}
