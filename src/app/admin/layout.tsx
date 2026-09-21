import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — MoliEmprende",
  description: "Panel de administración de registros MoliEmprende",
  icons: {
    icon: "/escudo-la-molina.png",
    shortcut: "/escudo-la-molina.png",
    apple: "/escudo-la-molina.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="fixed inset-0 flex flex-col overflow-hidden">{children}</div>;
}
