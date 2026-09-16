"use client";

import { useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { llamarApi, tokenSesion } from "@/lib/api/cliente";
import type { UsuarioPanel } from "@/lib/admin/types";

export default function AdminPage() {
  const [usuario, setUsuario] = useState<UsuarioPanel | null>(null);
  const [verificando, setVerificando] = useState(true);

  const verificarSesion = async () => {
    setVerificando(true);
    try {
      if (!tokenSesion()) {
        setUsuario(null);
        return;
      }
      const resultado = await llamarApi<{ usuario: UsuarioPanel }>("/autenticacion/perfil");
      if (!resultado.ok || !resultado.datos) {
        setUsuario(null);
        return;
      }
      setUsuario(resultado.datos.usuario);
    } catch {
      setUsuario(null);
    } finally {
      setVerificando(false);
    }
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  if (verificando) {
    return (
      <main className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-100">
        <p className="text-sm text-slate-500">Verificando sesión…</p>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="flex h-full items-center justify-center overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-10">
        <AdminLogin onSuccess={verificarSesion} />
      </main>
    );
  }

  return (
    <main className="flex h-full min-h-0 bg-gradient-to-br from-emerald-50 via-white to-slate-100">
      <AdminDashboard usuarioActual={usuario} />
    </main>
  );
}
