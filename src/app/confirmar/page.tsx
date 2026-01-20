import type { Metadata } from "next";
import Link from "next/link";
import { RSVPForm } from "@/components/features/rsvp/RSVPForm";
import { WEDDING_CONFIG } from "@/config/wedding";

export const metadata: Metadata = {
  title: "Confirmar Asistencia - Boda de Alberto & Carmen",
  description:
    "Confirma tu asistencia a la boda de Alberto y Carmen. Rellena el formulario para hacernos saber si podrás acompañarnos.",
};

export default function ConfirmarPage() {
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
                  className="text-gold-600 hover:text-gold-700 transition-colors underline underline-offset-2"
                >
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="text-stone-300 font-light">/</li>
              <li>
                <span className="text-stone-600 font-medium">Confirmar Asistencia</span>
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="font-display text-3xl sm:text-4xl text-stone-800 mb-4">
              Confirma tu asistencia
            </h1>
            <p className="text-stone-600 max-w-xl mx-auto">
              Nos hace mucha ilusión saber que podrás acompañarnos el{" "}
              <span className="text-gold-400 font-medium">
                {WEDDING_CONFIG.date.display}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <RSVPForm />
        </div>
      </section>
    </>
  );
}
