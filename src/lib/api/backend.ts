import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const COOKIE_SESION = "moliemprende_sesion";

/**
 * Base del NestJS, siempre con sufijo `/api` y sin barra final.
 * En producción debe apuntar al proceso del back (p. ej. http://127.0.0.1:403/api),
 * nunca al dominio público del front.
 */
function urlBaseApi(): string {
  const cruda =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:403/api";
  const sinBarra = cruda.trim().replace(/\/+$/, "");
  if (!sinBarra) return "http://localhost:403/api";
  return /\/api$/i.test(sinBarra) ? sinBarra : `${sinBarra}/api`;
}

export interface RespuestaBackend<T> {
  ok: boolean;
  estado: number;
  datos: T | null;
  error: string | null;
}

interface OpcionesLlamada {
  metodo?: "GET" | "POST" | "PATCH" | "DELETE";
  cuerpo?: unknown;
  /** Adjunta el token de la cookie de sesión. */
  conSesion?: boolean;
}

export async function llamarBackend<T>(
  ruta: string,
  opciones: OpcionesLlamada = {}
): Promise<RespuestaBackend<T>> {
  const { metodo = "GET", cuerpo, conSesion = true } = opciones;

  const cabeceras: Record<string, string> = {};
  if (cuerpo !== undefined) cabeceras["Content-Type"] = "application/json";

  if (conSesion) {
    const token = cookies().get(COOKIE_SESION)?.value;
    if (!token) {
      return { ok: false, estado: 401, datos: null, error: "No autorizado" };
    }
    cabeceras.Authorization = `Bearer ${token}`;
  }

  const camino = ruta.startsWith("/") ? ruta : `/${ruta}`;
  let respuesta: Response;
  try {
    respuesta = await fetch(`${urlBaseApi()}${camino}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      estado: 503,
      datos: null,
      error: "No se pudo conectar con el servidor",
    };
  }

  const contenido = await respuesta.text();
  if (esHtml(contenido)) {
    return {
      ok: false,
      estado: respuesta.status,
      datos: null,
      error: "servicio no encontrado",
    };
  }

  let cuerpoJson: unknown = null;
  if (contenido) {
    try {
      cuerpoJson = JSON.parse(contenido) as unknown;
    } catch {
      return {
        ok: false,
        estado: respuesta.status,
        datos: null,
        error: "servicio no encontrado",
      };
    }
  }

  if (!respuesta.ok) {
    return {
      ok: false,
      estado: respuesta.status,
      datos: null,
      error: mensajeDeError(cuerpoJson),
    };
  }

  return { ok: true, estado: respuesta.status, datos: cuerpoJson as T, error: null };
}

/** Traduce una respuesta fallida del backend a la respuesta que espera el panel. */
export function respuestaDeError(resultado: RespuestaBackend<unknown>): NextResponse {
  return NextResponse.json(
    { error: resultado.error ?? "Error inesperado" },
    { status: resultado.estado }
  );
}

function esHtml(contenido: string): boolean {
  const recorte = contenido.trimStart();
  return recorte.startsWith("<") || recorte.toLowerCase().startsWith("<!doctype");
}

function mensajeDeError(cuerpo: unknown): string {
  if (!cuerpo || typeof cuerpo !== "object") return "Error inesperado";
  const mensaje = (cuerpo as { message?: unknown; error?: unknown }).message;

  // NestJS devuelve un arreglo de mensajes cuando falla la validación.
  if (Array.isArray(mensaje)) return mensaje.join(". ");
  if (typeof mensaje === "string") return mensaje;

  const error = (cuerpo as { error?: unknown }).error;
  return typeof error === "string" ? error : "Error inesperado";
}
