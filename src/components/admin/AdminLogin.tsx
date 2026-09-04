"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "No se pudo iniciar sesión");
        return;
      }
      onSuccess();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-molina/10 p-3">
          <Shield className="h-6 w-6 text-molina" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-molina-dark">Acceso administrador</h1>
          <p className="text-sm text-slate-600">MoliEmprende — Municipalidad de La Molina</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-user" className="mb-1 block text-sm font-medium text-slate-700">
            Usuario
          </label>
          <input
            id="admin-user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-molina"
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-molina py-3 text-sm font-semibold text-white hover:bg-molina-dark disabled:opacity-50"
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
