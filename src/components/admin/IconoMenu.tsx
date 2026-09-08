import {
  BarChart3,
  ClipboardList,
  CircleDot,
  FileSpreadsheet,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Iconos disponibles para la columna `icono` de la tabla menus. */
const ICONOS: Record<string, LucideIcon> = {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
};

export function IconoMenu({
  nombre,
  className,
}: {
  nombre: string | null;
  className?: string;
}) {
  const Icono = (nombre && ICONOS[nombre]) || CircleDot;
  return <Icono className={className} />;
}
