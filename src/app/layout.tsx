import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MoliEmprende — Registro de Emprendedores | Municipalidad de La Molina",
  description:
    "Formulario de registro para emprendedores y artesanos del distrito de La Molina. Programa MoliEmprende de la Municipalidad de La Molina.",
  keywords: ["MoliEmprende", "La Molina", "emprendedores", "artesanos", "municipalidad"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
