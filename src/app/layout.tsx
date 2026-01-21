import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";

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
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alberto y Carmen - 14 de Noviembre de 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boda de Alberto & Carmen",
    description: "¡Nos casamos! 14 de Noviembre de 2026 en Jumilla",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

// JSON-LD Schema for Event
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Boda de Alberto y Carmen",
  startDate: "2026-11-14T12:00:00+01:00",
  endDate: "2026-11-15T04:00:00+01:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: [
    {
      "@type": "Place",
      name: "Iglesia Mayor de Santiago",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plaza de Arriba",
        addressLocality: "Jumilla",
        addressRegion: "Murcia",
        addressCountry: "ES",
      },
    },
    {
      "@type": "Place",
      name: "Salones Media Luna",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jumilla",
        addressRegion: "Murcia",
        addressCountry: "ES",
      },
    },
  ],
  description:
    "Boda de Alberto y Carmen. Ceremonia religiosa a las 12:00 en la Iglesia Mayor de Santiago, seguida de banquete y celebración en Salones Media Luna.",
  organizer: {
    "@type": "Person",
    name: "Alberto y Carmen",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {/* Skip link de accesibilidad */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-300 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2"
        >
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <BackToTop variant="solid" position="right" />
      </body>
    </html>
  );
}
