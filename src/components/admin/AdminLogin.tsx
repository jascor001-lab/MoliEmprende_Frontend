"use client";

import { useState } from "react";
import { guardarToken, llamarApi } from "@/lib/api/cliente";
import { EscudoMolina } from "@/components/ui/EscudoMolina";
import type { UsuarioPanel } from "@/lib/admin/types";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const resultado = await llamarApi<{ token: string; usuario: UsuarioPanel }>(
        "/autenticacion/iniciar-sesion",
        {
          metodo: "POST",
          cuerpo: { usuario, contrasena },
          conSesion: false,
        }
      );
      if (!resultado.ok || !resultado.datos?.token) {
        setError(resultado.error || "No se pudo iniciar sesión");
        return;
      }
      guardarToken(resultado.datos.token);
      onSuccess();
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <EscudoMolina className="h-12 w-12" />
        <div>
          <h1 className="text-xl font-bold text-molina-dark">Acceso al panel</h1>
          <p className="text-sm text-slate-600">
            Administradores y usuarios de consulta — MoliEmprende
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-user" className="mb-1 block text-sm font-medium text-slate-700">
            Usuario o correo
          </label>
          <input
            id="admin-user"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-molina"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="admin-pass" className="mb-1 block text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            id="admin-pass"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-molina"
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-xl bg-molina py-3 text-sm font-semibold text-white hover:bg-molina-dark disabled:opacity-50"
        >
          {cargando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
