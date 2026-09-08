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

export async function PATCH(request: Request) {
  let cuerpo: { id?: string; activo?: boolean };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!cuerpo.id || typeof cuerpo.activo !== "boolean") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const resultado = await llamarBackend<{ usuario: UsuarioPanel }>(
    `/usuarios/${encodeURIComponent(cuerpo.id)}/estado`,
    { metodo: "PATCH", cuerpo: { activo: cuerpo.activo } }
  );

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);
  return NextResponse.json({ ok: true, usuario: resultado.datos.usuario });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const resultado = await llamarBackend(`/usuarios/${encodeURIComponent(id)}`, {
    metodo: "DELETE",
  });

  if (!resultado.ok) return respuestaDeError(resultado);
  return NextResponse.json({ ok: true });
}
