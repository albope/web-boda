import type { Metadata } from "next";
import Link from "next/link";
import { Timeline } from "@/components/sections/Timeline";
import { LocationCards } from "@/components/sections/LocationCards";
import { DressCode } from "@/components/sections/DressCode";
import { FAQ } from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Detalles de la Boda - Alberto & Carmen",
  description:
    "Toda la información sobre la ceremonia, el banquete, ubicaciones, horarios y código de vestimenta para la boda de Alberto y Carmen.",
};

export default function DetallesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb editorial */}
          <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
            <ol className="flex items-center gap-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-stone-400 hover:text-gold-500 transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="text-stone-300 font-light">/</li>
              <li>
                <span className="text-stone-600 font-medium">Detalles</span>
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="font-display text-3xl sm:text-4xl text-stone-800 mb-4">
              Detalles de la Boda
            </h1>
            <p className="text-stone-600 max-w-xl mx-auto">
              Todo lo que necesitas saber para disfrutar de nuestro día especial
            </p>
          </div>
        </div>
      </section>

      <Timeline />
      <LocationCards />
      <DressCode />
      <FAQ />
    </>
  );
}
