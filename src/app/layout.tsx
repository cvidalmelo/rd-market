import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiniMarket",
  description: "CRUD de productos, usuarios y compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
