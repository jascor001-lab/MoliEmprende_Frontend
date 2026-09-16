const CLAVE_TOKEN = "moliemprende_token";

function normalizarBase(cruda: string): string {
  const sinBarra = cruda.trim().replace(/\/+$/, "");
  if (!sinBarra) return "/api";
  return /\/api$/i.test(sinBarra) ? sinBarra : `${sinBarra}/api`;
}

function esDireccionLocal(valor: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(valor);
}

/**
 * Base del API NestJS.
 * En el servidor (dominio público) siempre es /api — nginx lo manda al back.
 * En local usa NEXT_PUBLIC_API_URL (http://localhost:403/api).
 */
export function urlApi(): string {
  if (typeof window !== "undefined" && !esDireccionLocal(window.location.hostname)) {
    return "/api";
  }
  return normalizarBase(process.env.NEXT_PUBLIC_API_URL ?? "/api");
}

export function tokenSesion(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CLAVE_TOKEN);
}

export function guardarToken(token: string): void {
  window.localStorage.setItem(CLAVE_TOKEN, token);
}

export function borrarToken(): void {
  window.localStorage.removeItem(CLAVE_TOKEN);
}

export interface RespuestaApi<T> {
  ok: boolean;
  estado: number;
  datos: T | null;
  error: string | null;
}

interface OpcionesLlamada {
  metodo?: "GET" | "POST" | "PATCH" | "DELETE";
  cuerpo?: unknown;
  conSesion?: boolean;
}

export async function llamarApi<T>(
  ruta: string,
  opciones: OpcionesLlamada = {}
): Promise<RespuestaApi<T>> {
  const { metodo = "GET", cuerpo, conSesion = true } = opciones;
  const cabeceras: Record<string, string> = {};
  if (cuerpo !== undefined) cabeceras["Content-Type"] = "application/json";

  if (conSesion) {
    const token = tokenSesion();
    if (!token) {
      return { ok: false, estado: 401, datos: null, error: "No autorizado" };
    }
    cabeceras.Authorization = `Bearer ${token}`;
  }

  const camino = ruta.startsWith("/") ? ruta : `/${ruta}`;
  let respuesta: Response;
  try {
    respuesta = await fetch(`${urlApi()}${camino}`, {
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
    if (respuesta.status === 401) borrarToken();
    return {
      ok: false,
      estado: respuesta.status,
      datos: null,
      error: mensajeDeError(cuerpoJson),
    };
  }

  return { ok: true, estado: respuesta.status, datos: cuerpoJson as T, error: null };
}

function esHtml(contenido: string): boolean {
  const recorte = contenido.trimStart().toLowerCase();
  return recorte.startsWith("<") || recorte.startsWith("<!doctype");
}

function mensajeDeError(cuerpo: unknown): string {
  if (!cuerpo || typeof cuerpo !== "object") return "Error inesperado";
  const mensaje = (cuerpo as { message?: unknown; error?: unknown }).message;
  if (Array.isArray(mensaje)) return mensaje.join(". ");
  if (typeof mensaje === "string") return mensaje;
  const error = (cuerpo as { error?: unknown }).error;
  return typeof error === "string" ? error : "Error inesperado";
}
