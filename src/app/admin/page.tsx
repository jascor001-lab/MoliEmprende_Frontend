"use client";

import { useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { PublicPanelUser } from "@/lib/admin/types";

export default function AdminPage() {
  const [user, setUser] = useState<PublicPanelUser | null>(null);
  const [checking, setChecking] = useState(true);

  const checkSession = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as { user: PublicPanelUser };
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (checking) {
    return (
      <main className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-100">
        <p className="text-sm text-slate-500">Verificando sesión…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex h-full items-center justify-center overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-10">
        <AdminLogin onSuccess={checkSession} />
      </main>
    );
  }

  return (
    <main className="flex h-full min-h-0 bg-gradient-to-br from-emerald-50 via-white to-slate-100">
      <AdminDashboard currentUser={user} />
    </main>
  );
}
