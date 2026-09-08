"use client";

import { useEffect, useState } from "react";
import { Pencil, ShieldPlus, UserCheck, UserX, X } from "lucide-react";
import {
  ROL_ADMINISTRADOR,
  ROL_CONSULTOR,
  type PermisosMenu,
  type RolPanel,
  type UsuarioPanel,
} from "@/lib/admin/types";

interface UserManagementProps {
  idUsuarioActual: string;
  permisos?: PermisosMenu;
}

const FORMULARIO_VACIO = {
  nombreCompleto: "",
  usuario: "",
  correo: "",
  contrasena: "",
  rol: ROL_CONSULTOR,
};

export function UserManagement({ idUsuarioActual, permisos }: UserManagementProps) {
  const [usuarios, setUsuarios] = useState<UsuarioPanel[]>([]);
  const [roles, setRoles] = useState<RolPanel[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [editando, setEditando] = useState<UsuarioPanel | null>(null);

  const puedeCrear = permisos?.puedeCrear ?? true;
  const puedeEditar = permisos?.puedeEditar ?? true;
  const editandoSuPropiaCuenta = editando?.id === idUsuarioActual;

  const actualizarCampo = (campo: keyof typeof FORMULARIO_VACIO, valor: string) =>
    setFormulario((previo) => ({ ...previo, [campo]: valor }));

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      const [resUsuarios, resRoles] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
      ]);

      if (resUsuarios.status === 403) {
        setError("No tienes permiso para gestionar usuarios");
        return;
      }
      if (!resUsuarios.ok || !resRoles.ok) throw new Error("Error al cargar");

      const datosUsuarios = (await resUsuarios.json()) as { usuarios: UsuarioPanel[] };
      const datosRoles = (await resRoles.json()) as { roles: RolPanel[] };

      setUsuarios(datosUsuarios.usuarios);
      setRoles(datosRoles.roles);
    } catch {
      setError("No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const iniciarEdicion = (destino: UsuarioPanel) => {
    setEditando(destino);
    setFormulario({
      nombreCompleto: destino.nombreCompleto,
      usuario: destino.usuario,
      correo: destino.correo,
      contrasena: "",
      rol: destino.rol.nombre,
    });
    setError("");
    setExito("");
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setFormulario(FORMULARIO_VACIO);
    setError("");
    setExito("");
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");

    try {
      const res = editando
        ? await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editando.id, ...formulario }),
          })
        : await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formulario),
          });

      const datos = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(datos?.error || "No se pudo guardar el usuario");
        return;
      }

      if (editando) {
        setExito(`Usuario "${formulario.usuario}" actualizado`);
      } else {
        setExito(
          formulario.rol === ROL_ADMINISTRADOR
            ? "Administrador creado. Puede ver datos, Excel y gestionar usuarios."
            : "Usuario creado. Puede ver información y descargar Excel."
        );
      }

      setEditando(null);
      setFormulario(FORMULARIO_VACIO);
      await cargar();
    } catch {
      setError("Error de conexión al guardar el usuario");
    } finally {
      setGuardando(false);
    }
  };

  const alternarEstado = async (destino: UsuarioPanel) => {
    setError("");
    setExito("");
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: destino.id, activo: !destino.activo }),
    });
    const datos = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(datos?.error || "No se pudo actualizar");
      return;
    }
    await cargar();
  };

  const mostrarFormulario = editando ? puedeEditar : puedeCrear;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ShieldPlus className="h-5 w-5 text-molina" />
        <h2 className="text-lg font-semibold text-molina-dark">Gestión de usuarios</h2>
      </div>
      <p className="mb-5 text-sm text-slate-600">
        Crea cuentas con rol <strong>Administrador</strong> (gestiona usuarios + ve datos +
        Excel) o <strong>Usuario</strong> (ve información y descarga Excel). Las cuentas no
        se eliminan: se desactivan para conservar su historial.
      </p>

      {mostrarFormulario && (
        <form onSubmit={guardar} className="mb-6 grid gap-3 sm:grid-cols-2">
          {editando && (
            <div className="flex items-center justify-between rounded-xl bg-molina/5 px-3 py-2 sm:col-span-2">
              <p className="text-sm text-molina-dark">
                Editando a <strong>{editando.nombreCompleto}</strong>
              </p>
              <button
                type="button"
                onClick={cancelarEdicion}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white"
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </button>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Nombre completo
            </label>
            <input
              value={formulario.nombreCompleto}
              onChange={(e) => actualizarCampo("nombreCompleto", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
              placeholder="Ana Pérez"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Usuario</label>
            <input
              value={formulario.usuario}
              onChange={(e) => actualizarCampo("usuario", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
              placeholder="aperez"
              minLength={3}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Correo</label>
            <input
              type="email"
              value={formulario.correo}
              onChange={(e) => actualizarCampo("correo", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
              placeholder="aperez@lamolina.gob.pe"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Contraseña
            </label>
            <input
              type="password"
              value={formulario.contrasena}
              onChange={(e) => actualizarCampo("contrasena", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
              placeholder={
                editando ? "Déjala vacía para no cambiarla" : "Mínimo 6 caracteres"
              }
              minLength={6}
              required={!editando}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Tipo de usuario
            </label>
            <select
              value={formulario.rol}
              onChange={(e) => actualizarCampo("rol", e.target.value)}
              disabled={editandoSuPropiaCuenta}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina disabled:bg-slate-50 disabled:text-slate-400"
            >
              {roles.map((opcion) => (
                <option key={opcion.id} value={opcion.nombre}>
                  {opcion.etiqueta}
                  {opcion.descripcion ? ` — ${opcion.descripcion}` : ""}
                </option>
              ))}
            </select>
            {editandoSuPropiaCuenta && (
              <p className="mt-1 text-xs text-slate-500">
                No puedes cambiar tu propio rol.
              </p>
            )}
          </div>
          <div className="flex items-end gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-molina px-5 py-2.5 text-sm font-semibold text-white hover:bg-molina-dark disabled:opacity-50"
            >
              {guardando
                ? "Guardando…"
                : editando
                  ? "Guardar cambios"
                  : "Crear usuario"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {exito && (
        <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {exito}
        </p>
      )}

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando usuarios…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 pr-3 font-medium">Nombre</th>
                <th className="pb-2 pr-3 font-medium">Usuario</th>
                <th className="pb-2 pr-3 font-medium">Correo</th>
                <th className="pb-2 pr-3 font-medium">Rol</th>
                <th className="pb-2 pr-3 font-medium">Estado</th>
                <th className="pb-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((fila) => (
                <tr
                  key={fila.id}
                  className={`border-b border-slate-100 ${
                    editando?.id === fila.id ? "bg-molina/5" : ""
                  }`}
                >
                  <td className="py-3 pr-3 text-molina-dark">{fila.nombreCompleto}</td>
                  <td className="py-3 pr-3">{fila.usuario}</td>
                  <td className="py-3 pr-3 text-slate-500">{fila.correo}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        fila.rol.nombre === ROL_ADMINISTRADOR
                          ? "bg-molina/10 text-molina"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {fila.rol.etiqueta}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    {fila.activo ? (
                      <span className="text-emerald-600">Activo</span>
                    ) : (
                      <span className="text-slate-400">Inactivo</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        title="Editar"
                        disabled={!puedeEditar}
                        onClick={() => iniciarEdicion(fila)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-molina/10 hover:text-molina disabled:opacity-30"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={fila.activo ? "Desactivar" : "Activar"}
                        disabled={!puedeEditar || fila.id === idUsuarioActual}
                        onClick={() => alternarEstado(fila)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      >
                        {fila.activo ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
