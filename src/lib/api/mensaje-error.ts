/** Si el proxy devolvió HTML en vez de JSON, no lo mostramos crudo. */
export async function mensajeErrorHttp(
  res: Response,
  respaldo: string
): Promise<string> {
  const texto = await res.text();
  const recorte = texto.trimStart().toLowerCase();
  if (recorte.startsWith("<") || recorte.startsWith("<!doctype")) {
    return "servicio no encontrado";
  }
  try {
    const datos = JSON.parse(texto) as { error?: string };
    return datos.error || respaldo;
  } catch {
    return "servicio no encontrado";
  }
}
