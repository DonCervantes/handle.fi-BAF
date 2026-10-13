import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Handle.Fi — Control de pagos internacionales para PyMEs",
  description:
    "Controla de principio a fin los pagos de tu PyME a colaboradores en LatAm: costo real, estado verificable y comprobante conciliado. Sobre Stellar testnet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Nav />
        <main className="min-h-[calc(100vh-64px)] py-8">{children}</main>
      </body>
    </html>
  );
}
