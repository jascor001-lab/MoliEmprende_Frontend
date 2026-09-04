"use client";

import { useEffect, useState } from "react";
import { Download, LogOut, Users, Palette, Rocket, RefreshCw } from "lucide-react";
import type { RegistrationRecord } from "@/lib/registrations/types";
import { downloadRegistrationsExcel } from "@/lib/registrations/excel";

interface Stats {
  totalSubmissions: number;
  uniqueByDni: number;
  emprendedores: number;
  artesanos: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, listRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/registrations"),
      ]);

      if (statsRes.status === 401 || listRes.status === 401) {
        window.location.reload();
        return;
      }

      if (!statsRes.ok || !listRes.ok) {
        throw new Error("No se pudieron cargar los datos");
      }

      const statsData = (await statsRes.json()) as Stats;
      const listData = (await listRes.json()) as {
        records: RegistrationRecord[];
      };

      setStats(statsData);
      setRecords(listData.records);
    } catch {
      setError("Error al cargar el panel. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadRegistrationsExcel(records);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-molina-dark">Panel administrador</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registros de emprendedores y artesanos unificados por DNI
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Cargando…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-5 w-5 text-molina" />}
              label="Personas (por DNI)"
              value={stats?.uniqueByDni ?? 0}
            />
            <StatCard
              icon={<Rocket className="h-5 w-5 text-molina" />}
              label="Emprendedores"
              value={stats?.emprendedores ?? 0}
            />
            <StatCard
              icon={<Palette className="h-5 w-5 text-molina" />}
              label="Artesanos"
              value={stats?.artesanos ?? 0}
            />
            <StatCard
              icon={<Users className="h-5 w-5 text-slate-500" />}
              label="Envíos totales"
              value={stats?.totalSubmissions ?? 0}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-molina-dark">Exportar Excel</h2>
            <p className="mt-2 text-sm text-slate-600">
              Una sola lista ordenada por DNI. Emprendedores y artesanos en las mismas
              columnas (línea artesanal / RNA vacías si no aplican) para filtrar en Excel.
            </p>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || records.length === 0}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-molina px-5 py-3 text-sm font-semibold text-white transition hover:bg-molina-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Generando…" : "Descargar Excel"}
            </button>
            {records.length === 0 && (
              <p className="mt-3 text-sm text-slate-500">
                Aún no hay registros. Cuando alguien complete el formulario, aparecerán aquí.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-molina-dark">{value}</p>
    </div>
  );
}
