import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — MoliEmprende",
  description: "Panel de administración de registros MoliEmprende",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="fixed inset-0 overflow-y-auto">{children}</div>;
}
