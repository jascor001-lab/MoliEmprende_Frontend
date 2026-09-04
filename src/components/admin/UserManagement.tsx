"use client";

import { useEffect, useState } from "react";
import { ShieldPlus, Trash2, UserCheck, UserX } from "lucide-react";
import type { PanelRole, PublicPanelUser } from "@/lib/admin/types";

interface UserManagementProps {
  currentUserId: string;
}

export function UserManagement({ currentUserId }: UserManagementProps) {
  const [users, setUsers] = useState<PublicPanelUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<PanelRole>("user");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403) {
        setError("No tienes permiso para gestionar usuarios");
        return;
      }
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = (await res.json()) as { users: PublicPanelUser[] };
      setUsers(data.users);
    } catch {
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, role }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!res.ok) {
        setError(data?.error || "No se pudo crear el usuario");
        return;
      }
      setSuccess(
        role === "admin"
          ? "Administrador creado. Puede ver datos, Excel y gestionar usuarios."
          : "Usuario creado. Puede ver información y descargar Excel."
      );
      setFullName("");
      setUsername("");
      setPassword("");
      setRole("user");
      await loadUsers();
    } catch {
      setError("Error de conexión al crear usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: PublicPanelUser) => {
    setError("");
    setSuccess("");
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, active: !user.active }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(data?.error || "No se pudo actualizar");
      return;
    }
    await loadUsers();
  };

  const handleDelete = async (user: PublicPanelUser) => {
    if (!confirm(`¿Eliminar al usuario "${user.username}"?`)) return;
    setError("");
    setSuccess("");
    const res = await fetch(`/api/admin/users?id=${encodeURIComponent(user.id)}`, {
      method: "DELETE",
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(data?.error || "No se pudo eliminar");
      return;
    }
    setSuccess("Usuario eliminado");
    await loadUsers();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ShieldPlus className="h-5 w-5 text-molina" />
        <h2 className="text-lg font-semibold text-molina-dark">Gestión de usuarios</h2>
      </div>
      <p className="mb-5 text-sm text-slate-600">
        Crea cuentas con rol <strong>Administrador</strong> (gestiona usuarios + ve datos +
        Excel) o <strong>Usuario</strong> (ve información y descarga Excel).
      </p>

      <form onSubmit={handleCreate} className="mb-6 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Nombre completo
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
            placeholder="Ana Pérez"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Usuario</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
            placeholder="aperez"
            minLength={3}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Tipo de usuario
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as PanelRole)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-molina"
          >
            <option value="user">Usuario (ver + Excel)</option>
            <option value="admin">Administrador (gestión + ver + Excel)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-molina px-5 py-2.5 text-sm font-semibold text-white hover:bg-molina-dark disabled:opacity-50"
          >
            {saving ? "Creando…" : "Crear usuario"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Cargando usuarios…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 pr-3 font-medium">Nombre</th>
                <th className="pb-2 pr-3 font-medium">Usuario</th>
                <th className="pb-2 pr-3 font-medium">Rol</th>
                <th className="pb-2 pr-3 font-medium">Estado</th>
                <th className="pb-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="py-3 pr-3 text-molina-dark">{user.fullName}</td>
                  <td className="py-3 pr-3">{user.username}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-molina/10 text-molina"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    {user.active ? (
                      <span className="text-emerald-600">Activo</span>
                    ) : (
                      <span className="text-slate-400">Inactivo</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        title={user.active ? "Desactivar" : "Activar"}
                        disabled={user.id === currentUserId}
                        onClick={() => handleToggleActive(user)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      >
                        {user.active ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        title="Eliminar"
                        disabled={user.id === currentUserId}
                        onClick={() => handleDelete(user)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
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
