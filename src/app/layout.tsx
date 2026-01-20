import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Boda de Alberto & Carmen - 14 de Noviembre de 2026",
  description:
    "Toda la información sobre la boda de Alberto y Carmen, el 14 de noviembre de 2026 en Jumilla. Confirma tu asistencia y entérate de todos los detalles.",
  keywords: ["boda", "Alberto", "Carmen", "Jumilla", "2026", "invitación"],
  authors: [{ name: "Alberto y Carmen" }],
  openGraph: {
    title: "Boda de Alberto & Carmen",
    description: "¡Nos casamos! 14 de Noviembre de 2026 en Jumilla",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
