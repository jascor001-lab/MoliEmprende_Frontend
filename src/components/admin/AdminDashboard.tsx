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
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import type { RegistrationRecord } from "@/lib/registrations/types";
import { downloadRegistrationsExcel } from "@/lib/registrations/excel";
import type { MenuPanel, UsuarioPanel } from "@/lib/admin/types";
import { esAdministrador } from "@/lib/admin/types";
import { UserManagement } from "@/components/admin/UserManagement";
import { IconoMenu } from "@/components/admin/IconoMenu";
import { borrarToken, llamarApi } from "@/lib/api/cliente";
import { aRegistroPanel } from "@/lib/registrations/mapeo";
import { EscudoMolina } from "@/components/ui/EscudoMolina";

interface Estadisticas {
  totalEnvios: number;
  totalPersonas: number;
  emprendedores: number;
  artesanos: number;
}

interface AdminDashboardProps {
  usuarioActual: UsuarioPanel;
}

export function AdminDashboard({ usuarioActual }: AdminDashboardProps) {
  const [menus, setMenus] = useState<MenuPanel[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [registros, setRegistros] = useState<RegistrationRecord[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [descargando, setDescargando] = useState(false);
  const [seccion, setSeccion] = useState<string>("");
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [barraColapsada, setBarraColapsada] = useState(false);

  const esAdmin = esAdministrador(usuarioActual);
  const menuActivo = menus.find((menu) => menu.codigo === seccion) ?? null;

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      const [resMenus, resEstadisticas, resRegistros] = await Promise.all([
        llamarApi<{ menus: MenuPanel[] }>("/menus/mios"),
        llamarApi<Estadisticas>("/registros/estadisticas"),
        llamarApi<{ registros: Record<string, unknown>[] }>("/registros"),
      ]);

      if (
        [resMenus, resEstadisticas, resRegistros].some((res) => res.estado === 401)
      ) {
        window.location.reload();
        return;
      }

      if (!resMenus.ok || !resEstadisticas.ok || !resRegistros.ok) {
        throw new Error("No se pudieron cargar los datos");
      }

      setMenus(resMenus.datos?.menus ?? []);
      setEstadisticas(resEstadisticas.datos);
      setRegistros((resRegistros.datos?.registros ?? []).map(aRegistroPanel));
    } catch {
      setError("Error al cargar el panel. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // La sección visible siempre debe ser uno de los menús que el rol tiene permitidos.
  useEffect(() => {
    if (menus.length === 0) return;
    if (!menus.some((menu) => menu.codigo === seccion)) {
      setSeccion(menus[0].codigo);
    }
  }, [menus, seccion]);

  const cerrarSesion = async () => {
    borrarToken();
    window.location.reload();
  };

  const descargarExcel = () => {
    setDescargando(true);
    try {
      downloadRegistrationsExcel(registros);
    } finally {
      setDescargando(false);
    }
  };

  const elegirSeccion = (codigo: string) => {
    setSeccion(codigo);
    setMenuMovilAbierto(false);
  };

  const renderBarraLateral = (colapsada: boolean) => (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <EscudoMolina className="h-9 w-9" />
          {!colapsada && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">MoliEmprende</p>
              <p className="truncate text-xs text-emerald-100/80">Panel interno</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menus.map((menu) => {
          const activo = seccion === menu.codigo;
          return (
            <button
              key={menu.id}
              type="button"
              onClick={() => elegirSeccion(menu.codigo)}
              title={menu.nombre}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                activo
                  ? "bg-white text-molina shadow-sm"
                  : "text-emerald-50/90 hover:bg-white/10"
              } ${colapsada ? "justify-center" : ""}`}
            >
              <IconoMenu nombre={menu.icono} className="h-5 w-5 shrink-0" />
              {!colapsada && <span>{menu.nombre}</span>}
            </button>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        {!colapsada && (
          <div className="rounded-xl bg-white/10 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">
              {usuarioActual.nombreCompleto}
            </p>
            <p className="truncate text-xs text-emerald-100/80">
              @{usuarioActual.usuario} · {usuarioActual.rol.etiqueta}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={cerrarSesion}
          title="Salir"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-50/90 transition hover:bg-white/10 ${
            colapsada ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!colapsada && <span>Salir</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* Barra lateral de escritorio */}
      <aside
        className={`relative z-20 hidden shrink-0 bg-gradient-to-b from-[#008A4B] to-[#065F46] transition-all duration-300 md:flex md:flex-col ${
          barraColapsada ? "w-[72px]" : "w-64"
        }`}
      >
        <button
          type="button"
          onClick={() => setBarraColapsada((v) => !v)}
          className="absolute -right-3 top-20 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-molina shadow-sm"
          aria-label={barraColapsada ? "Expandir menú" : "Colapsar menú"}
        >
          {barraColapsada ? (
            <PanelLeft className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>
        {renderBarraLateral(barraColapsada)}
      </aside>

      {/* Menú deslizable en móvil */}
      <AnimatePresence>
        {menuMovilAbierto && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMenuMovilAbierto(false)}
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
                onClick={() => setMenuMovilAbierto(false)}
                className="absolute right-3 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
              {renderBarraLateral(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuMovilAbierto(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-molina-dark sm:text-xl">
                {tituloDeSeccion(menuActivo)}
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                {usuarioActual.rol.etiqueta}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cargar}
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

          {cargando ? (
            <p className="text-sm text-slate-500">Cargando…</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={seccion}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                className="mx-auto max-w-4xl space-y-6"
              >
                {seccion === "resumen" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Tarjeta
                        icono={<Users className="h-5 w-5 text-molina" />}
                        etiqueta="Personas (por DNI)"
                        valor={estadisticas?.totalPersonas ?? 0}
                      />
                      <Tarjeta
                        icono={<Rocket className="h-5 w-5 text-molina" />}
                        etiqueta="Emprendedores"
                        valor={estadisticas?.emprendedores ?? 0}
                      />
                      <Tarjeta
                        icono={<Palette className="h-5 w-5 text-molina" />}
                        etiqueta="Artesanos"
                        valor={estadisticas?.artesanos ?? 0}
                      />
                      <Tarjeta
                        icono={<Users className="h-5 w-5 text-slate-500" />}
                        etiqueta="Envíos totales"
                        valor={estadisticas?.totalEnvios ?? 0}
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
                        onClick={descargarExcel}
                        disabled={descargando || registros.length === 0}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-molina px-5 py-3 text-sm font-semibold text-white transition hover:bg-molina-dark disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Download className="h-4 w-4" />
                        {descargando ? "Generando…" : "Descargar Excel"}
                      </button>
                      {registros.length === 0 && (
                        <p className="mt-3 text-sm text-slate-500">
                          Aún no hay registros. Cuando alguien complete el formulario,
                          aparecerán aquí.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {seccion === "usuarios" && esAdmin && (
                  <UserManagement
                    idUsuarioActual={usuarioActual.id}
                    permisos={menuActivo?.permisos}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function tituloDeSeccion(menu: MenuPanel | null): string {
  if (!menu) return "Panel";
  return menu.codigo === "resumen" ? "Resumen de registros" : `Gestión de ${menu.nombre.toLowerCase()}`;
}

function Tarjeta({
  icono,
  etiqueta,
  valor,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  valor: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-600">
        {icono}
        <span className="text-sm font-medium">{etiqueta}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-molina-dark">{valor}</p>
    </div>
  );
}
