"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  LogOut,
  Users,
  Palette,
  Rocket,
  RefreshCw,
  LayoutDashboard,
  UserCog,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import type { RegistrationRecord } from "@/lib/registrations/types";
import { downloadRegistrationsExcel } from "@/lib/registrations/excel";
import type { PublicPanelUser } from "@/lib/admin/types";
import { UserManagement } from "@/components/admin/UserManagement";

type AdminSection = "resumen" | "usuarios";

interface Stats {
  totalSubmissions: number;
  uniqueByDni: number;
  emprendedores: number;
  artesanos: number;
}

interface AdminDashboardProps {
  currentUser: PublicPanelUser;
}

export function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [section, setSection] = useState<AdminSection>("resumen");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAdmin = currentUser.role === "admin";

  const navItems: {
    id: AdminSection;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
  }[] = [
    {
      id: "resumen",
      label: "Resumen",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
    },
    {
      id: "usuarios",
      label: "Usuarios",
      icon: <UserCog className="h-5 w-5 shrink-0" />,
      adminOnly: true,
    },
  ];

  const visibleNav = navItems.filter((item) => !item.adminOnly || isAdmin);

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

  useEffect(() => {
    if (!isAdmin && section === "usuarios") setSection("resumen");
  }, [isAdmin, section]);

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

  const selectSection = (id: AdminSection) => {
    setSection(id);
    setMobileOpen(false);
  };

  const renderSidebar = (collapsed: boolean) => (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#4ADE80] via-[#008A4B] to-[#065F46] text-[10px] font-black text-white shadow-md">
            ME
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">MoliEmprende</p>
              <p className="truncate text-xs text-emerald-100/80">Panel interno</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {visibleNav.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectSection(item.id)}
              title={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white text-molina shadow-sm"
                  : "text-emerald-50/90 hover:bg-white/10"
              } ${collapsed ? "justify-center" : ""}`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        {!collapsed && (
          <div className="rounded-xl bg-white/10 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">
              {currentUser.fullName}
            </p>
            <p className="truncate text-xs text-emerald-100/80">
              @{currentUser.username} · {isAdmin ? "Admin" : "Usuario"}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          title="Salir"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-50/90 transition hover:bg-white/10 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Salir</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* Desktop sidebar */}
      <aside
        className={`relative z-20 hidden shrink-0 bg-gradient-to-b from-[#008A4B] to-[#065F46] transition-all duration-300 md:flex md:flex-col ${
          sidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <button
          type="button"
          onClick={() => setSidebarCollapsed((v) => !v)}
          className="absolute -right-3 top-20 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-molina shadow-sm"
          aria-label={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>
        {renderSidebar(sidebarCollapsed)}
      </aside>

      {/* Mobile slider overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#008A4B] to-[#065F46] shadow-2xl md:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
              {renderSidebar(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-molina-dark sm:text-xl">
                {section === "resumen" && "Resumen de registros"}
                {section === "usuarios" && "Gestión de usuarios"}
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                {isAdmin ? "Administrador" : "Usuario de consulta"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Cargando…</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                className="mx-auto max-w-4xl space-y-6"
              >
                {section === "resumen" && (
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
                      <h2 className="text-lg font-semibold text-molina-dark">
                        Exportar lista Excel
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Una sola lista ordenada por DNI. Emprendedores y artesanos en las
                        mismas columnas para filtrar en Excel.
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
                          Aún no hay registros. Cuando alguien complete el formulario,
                          aparecerán aquí.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {section === "usuarios" && isAdmin && (
                  <UserManagement currentUserId={currentUser.id} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
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
