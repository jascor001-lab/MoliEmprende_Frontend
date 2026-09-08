export const ROL_ADMINISTRADOR = "administrador";
export const ROL_CONSULTOR = "consultor";

export interface RolPanel {
  id: string;
  nombre: string;
  etiqueta: string;
  descripcion?: string | null;
}

export interface UsuarioPanel {
  id: string;
  usuario: string;
  nombreCompleto: string;
  correo: string;
  rol: RolPanel;
  activo: boolean;
  ultimoAcceso: string | null;
  creadoEn: string;
}

export interface PermisosMenu {
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
}

/** Entrada del menú lateral, tal como la entrega la tabla menus según el rol. */
export interface MenuPanel {
  id: string;
  codigo: string;
  nombre: string;
  ruta: string | null;
  icono: string | null;
  orden: number;
  permisos: PermisosMenu;
  hijos: MenuPanel[];
}

export function esAdministrador(usuario: UsuarioPanel): boolean {
  return usuario.rol?.nombre === ROL_ADMINISTRADOR;
}
