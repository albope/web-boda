import type { Metadata } from "next";
import Link from "next/link";
import { PhotoGallery } from "@/components/features/gallery/PhotoGallery";

export const metadata: Metadata = {
  title: "Galería de Fotos - Alberto & Carmen",
  description:
    "Comparte y disfruta las fotos de la boda de Alberto y Carmen. Una galería colaborativa donde todos los invitados pueden subir sus mejores momentos.",
};

export default function GaleriaPage() {
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
              <li aria-hidden="true" className="text-stone-300 font-light">
                /
              </li>
              <li>
                <span className="text-stone-600 font-medium">Galería</span>
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="font-display text-3xl sm:text-4xl text-stone-800 mb-4">
              Galería de Fotos
            </h1>
            <p className="text-stone-600 max-w-xl mx-auto">
              Comparte tus mejores momentos y revive los recuerdos de nuestro
              día especial
            </p>
          </div>
        </div>
      </section>

      <PhotoGallery />
    </>
  );
}
