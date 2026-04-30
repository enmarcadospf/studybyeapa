import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Study by EAPA",
  description: "Plataforma web para estudiantes de medicina con IA, flashcards y examenes.",
};

export const viewport: Viewport = {
  themeColor: "#0d5bd7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
