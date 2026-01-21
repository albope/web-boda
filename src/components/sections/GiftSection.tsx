"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

export function GiftSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyIban = async () => {
    try {
      // Copiar IBAN sin espacios
      const ibanClean = WEDDING_CONFIG.gift.iban.replace(/\s/g, "");
      await navigator.clipboard.writeText(ibanClean);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para navegadores sin soporte de clipboard
      const textArea = document.createElement("textarea");
      textArea.value = WEDDING_CONFIG.gift.iban.replace(/\s/g, "");
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="lista-bodas"
      className="py-16 sm:py-20 bg-gradient-to-b from-cream-100 to-cream-50"
      aria-labelledby="gift-title"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-50 rounded-full mb-6">
            <Gift className="w-8 h-8 text-gold-400" aria-hidden="true" />
          </div>

          <h2
            id="gift-title"
            className="font-display text-2xl sm:text-3xl text-stone-800 mb-3"
          >
            {WEDDING_CONFIG.gift.title}
          </h2>

          <p className="text-gold-400 font-medium text-lg flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" aria-hidden="true" />
            {WEDDING_CONFIG.gift.subtitle}
            <Heart className="w-4 h-4" aria-hidden="true" />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <p className="text-stone-600 text-center mb-8 max-w-md mx-auto">
            {WEDDING_CONFIG.gift.message}
          </p>

          <div className="space-y-4">
            {/* IBAN con botón de copiar */}
            <div className="bg-cream-50 rounded-xl p-4 sm:p-5">
              <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">
                Número de cuenta (IBAN)
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-sm sm:text-base text-stone-800 tracking-wide break-all">
                  {WEDDING_CONFIG.gift.iban}
                </p>
                <button
                  onClick={handleCopyIban}
                  className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    copied
                      ? "bg-green-100 text-green-600"
                      : "bg-gold-50 text-gold-400 hover:bg-gold-100 active:scale-95"
                  }`}
                  aria-label={copied ? "IBAN copiado" : "Copiar IBAN"}
                >
                  {copied ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Copy className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 text-sm mt-2"
                >
                  IBAN copiado al portapapeles
                </motion.p>
              )}
            </div>

            {/* Detalles adicionales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-cream-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                  Titular
                </p>
                <p className="text-stone-800 font-medium">
                  {WEDDING_CONFIG.gift.accountHolder}
                </p>
              </div>
              <div className="bg-cream-50 rounded-xl p-4">
                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                  Banco
                </p>
                <p className="text-stone-800 font-medium">
                  {WEDDING_CONFIG.gift.bankName}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
