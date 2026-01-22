import Link from "next/link";
import { Heart, MessageCircle, Cloud } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

export function Footer() {
  return (
    <footer className="bg-stone-800 text-cream-100 pt-12 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Grid de contenido */}
        <div className="grid gap-8 sm:grid-cols-3 mb-8 text-center sm:text-left">
          {/* Columna 1: Branding */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="font-display text-xl">
                {WEDDING_CONFIG.couple.partner1}
              </span>
              <Heart
                className="w-4 h-4 text-gold-300 fill-gold-300"
                aria-hidden="true"
              />
              <span className="font-display text-xl">
                {WEDDING_CONFIG.couple.partner2}
              </span>
            </div>
            <p className="text-cream-400 text-sm">
              {WEDDING_CONFIG.date.display}
            </p>
            <p className="text-cream-500 text-xs mt-1">
              {WEDDING_CONFIG.location.city}, {WEDDING_CONFIG.location.region}
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-medium text-cream-200 mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm text-cream-400">
              <li>
                <Link
                  href="/detalles"
                  className="hover:text-gold-300 transition-colors"
                >
                  Detalles del evento
                </Link>
              </li>
              <li>
                <Link
                  href="/confirmar"
                  className="hover:text-gold-300 transition-colors"
                >
                  Confirmar asistencia
                </Link>
              </li>
              <li>
                <a
                  href="#como-llegar"
                  className="hover:text-gold-300 transition-colors"
                >
                  Cómo llegar
                </a>
              </li>
              <li>
                <Link
                  href="/detalles#dresscode-title"
                  className="hover:text-gold-300 transition-colors inline-flex items-center gap-2"
                >
                  <Cloud className="w-4 h-4" aria-hidden="true" />
                  Pronóstico del tiempo
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="font-medium text-cream-200 mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-cream-400">
              <li>
                <a
                  href={`https://wa.me/${WEDDING_CONFIG.contact.alberto.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  {WEDDING_CONFIG.contact.alberto.name}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WEDDING_CONFIG.contact.carmen.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  {WEDDING_CONFIG.contact.carmen.name}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="h-px bg-stone-700" />
      </div>
    </footer>
  );
}
