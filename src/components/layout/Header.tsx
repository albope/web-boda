"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/detalles", label: "Detalles" },
  { href: "/#como-llegar", label: "Cómo Llegar" },
  { href: "/confirmar", label: "Confirmar Asistencia" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-cream-100/95 backdrop-blur-sm border-b border-cream-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Couple Names */}
          <Link
            href="/"
            className="font-display text-xl sm:text-2xl text-stone-800 hover:text-gold-300 transition-colors"
            onClick={closeMenu}
          >
            {WEDDING_CONFIG.couple.partner1} & {WEDDING_CONFIG.couple.partner2}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-stone-600 hover:text-stone-800 transition-colors text-sm font-medium",
                  link.href === "/confirmar" &&
                    "bg-gold-300 text-white px-4 py-2 rounded-full hover:bg-gold-400 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-stone-600 hover:text-stone-800 transition-colors"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-4 py-4 space-y-2 bg-cream-50 border-t border-cream-200" aria-label="Navegación móvil">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block py-3 px-4 text-stone-600 hover:text-stone-800 hover:bg-cream-200 rounded-lg transition-colors text-center",
                link.href === "/confirmar" &&
                  "bg-gold-300 text-white hover:bg-gold-400 hover:text-white mt-4"
              )}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
