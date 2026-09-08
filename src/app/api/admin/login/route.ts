import { NextResponse } from "next/server";
import { COOKIE_SESION, llamarBackend, respuestaDeError } from "@/lib/api/backend";
import type { UsuarioPanel } from "@/lib/admin/types";

const OCHO_HORAS = 8 * 60 * 60;

export async function POST(request: Request) {
  let cuerpo: { usuario?: string; contrasena?: string };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!cuerpo.usuario || !cuerpo.contrasena) {
    return NextResponse.json(
      { error: "Usuario y contraseña son obligatorios" },
      { status: 400 }
    );
  }

  const resultado = await llamarBackend<{ token: string; usuario: UsuarioPanel }>(
    "/autenticacion/iniciar-sesion",
    {
      metodo: "POST",
      cuerpo: { usuario: cuerpo.usuario, contrasena: cuerpo.contrasena },
      conSesion: false,
    }
  );

  if (!resultado.ok || !resultado.datos) return respuestaDeError(resultado);

  const respuesta = NextResponse.json({ ok: true, usuario: resultado.datos.usuario });
  respuesta.cookies.set(COOKIE_SESION, resultado.datos.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: vigenciaDelToken(resultado.datos.token),
  });

  return respuesta;
}

/** La cookie caduca junto con el token para no dejar sesiones fantasma. */
function vigenciaDelToken(token: string): number {
  try {
    const carga = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf-8")
    ) as { exp?: number };

    const segundos = (carga.exp ?? 0) - Math.floor(Date.now() / 1000);
    return segundos > 0 ? segundos : OCHO_HORAS;
  } catch {
    return OCHO_HORAS;
  }
}
