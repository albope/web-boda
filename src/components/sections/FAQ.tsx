"use client";

import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEDDING_CONFIG } from "@/config/wedding";

const faqItems = [
  {
    question: "¿Cuál es el código de vestimenta?",
    answer: `${WEDDING_CONFIG.dressCode.style}. ${WEDDING_CONFIG.dressCode.description}`,
  },
  {
    question: "¿Hay parking disponible?",
    answer:
      "Sí, hay aparcamiento gratuito disponible en el recinto de Salones Media Luna. En la Iglesia Mayor de Santiago aparcar es complicado, os recomendamos llegar con tiempo o ir andando si es posible.",
  },
  {
    question: "¿Puedo llevar niños?",
    answer:
      "¡Por supuesto! Los niños son bienvenidos a nuestra celebración. Disponemos de menú infantil para los más pequeños, solo tienes que indicarlo al confirmar tu asistencia.",
  },
  {
    question: "¿Hay opciones de menú especiales?",
    answer:
      "Sí, podemos adaptar el menú para alergias, intolerancias o dietas especiales (vegetariano, celíaco, etc.). Por favor, indicadlo al confirmar vuestra asistencia.",
  },
  {
    question: "¿Hasta qué hora es la fiesta?",
    answer:
      "La celebración está prevista hasta las 4:00 de la madrugada aproximadamente. ¡Venid con ganas de bailar!",
  },
  {
    question: "¿Puedo subir fotos a redes sociales?",
    answer:
      "¡Por supuesto! También tendremos un álbum compartido disponible en esta misma web donde podréis subir vuestras fotos para que todos las veamos.",
  },
  {
    question: "¿Dónde puedo hacer una contribución?",
    answer:
      "En la sección <a href='/#regalos-boda' class='text-gold-500 hover:text-gold-600 underline underline-offset-2'>Regalos de Boda</a> encontraréis toda la información.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="faq-title">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            id="faq-title"
            className="font-display text-2xl sm:text-3xl text-stone-800 mb-4"
          >
            Preguntas frecuentes
          </h2>
          <p className="text-stone-600">
            Resolvemos vuestras dudas más comunes
          </p>
        </motion.div>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Accordion.Item
                value={`item-${index}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between p-4 sm:p-5 text-left group">
                    <span className="font-medium text-stone-800 pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gold-400 flex-shrink-0 transition-transform duration-300",
                        "group-data-[state=open]:rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-slide-up data-[state=closed]:animate-fade-in">
                  <div
                    className="px-4 sm:px-5 pb-4 sm:pb-5 text-stone-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
