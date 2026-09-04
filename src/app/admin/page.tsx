"use client";

import { useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  const checkSession = async () => {
    const res = await fetch("/api/admin/stats");
    setAuthed(res.ok);
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <main className="min-h-screen overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-10">
      {authed === null ? (
        <p className="text-center text-sm text-slate-500">Verificando sesión…</p>
      ) : authed ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onSuccess={() => setAuthed(true)} />
      )}
    </main>
  );
}
