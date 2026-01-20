"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Plane } from "lucide-react";

interface StoryMoment {
  year?: string;
  icon?: "plane";
  title: string;
  description: string;
  image?: string;
}

const storyMoments: StoryMoment[] = [
  {
    year: "2021",
    title: "Nos conocimos",
    description: "Nos cruzamos por primera vez en el lugar más inesperado: el trabajo. Entre rutinas diarias y días que parecían iguales, empezó algo que ninguno de los dos supo ver venir. Sin darnos cuenta, aquel encuentro se convirtió en el comienzo de nuestra historia.",
    image: "/images/story/conocimos.jpg",
  },
  {
    icon: "plane",
    title: "Descubriendo el mundo juntos",
    description: "Empezamos a sumar destinos, recuerdos y experiencias. Viajar juntos nos enseñó que éramos un gran equipo, dentro y fuera de casa.",
    image: "/images/story/viajes.jpg",
  },
  {
    year: "2023",
    title: "Empezamos a vivir juntos",
    description: "Decidimos dar el paso y construir nuestro hogar juntos. Cada día ha sido una nueva aventura.",
    image: "/images/story/juntos.jpg",
  },
  {
    year: "2025",
    title: "La pedida",
    description: "En un momento mágico e inesperado, decidimos que queríamos pasar el resto de nuestras vidas juntos.",
    image: "/images/story/pedida.jpg",
  },
];

export function OurStory() {
  return (
    <section id="nuestra-historia" className="py-16 sm:py-24 bg-white" aria-labelledby="our-story-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gold-300" />
            <Heart className="w-5 h-5 text-gold-400" aria-hidden="true" />
            <div className="h-px w-12 bg-gold-300" />
          </div>
          <h2
            id="our-story-title"
            className="font-display text-3xl sm:text-4xl text-stone-800 mb-4"
          >
            Nuestra Historia
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            El camino que nos ha llevado hasta aquí, lleno de momentos inolvidables
          </p>
        </motion.div>

        <div className="space-y-12 sm:space-y-16">
          {storyMoments.map((moment, index) => (
            <motion.div
              key={moment.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200 shadow-lg">
                  {moment.image ? (
                    <Image
                      src={moment.image}
                      alt={moment.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-stone-400">
                        <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Foto próximamente</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                {moment.year && (
                  <span className="inline-block px-3 py-1 bg-gold-100 text-gold-500 rounded-full text-sm font-medium mb-3">
                    {moment.year}
                  </span>
                )}
                {moment.icon === "plane" && (
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gold-100 text-gold-500 rounded-full mb-3">
                    <Plane className="w-4 h-4" />
                  </span>
                )}
                <h3 className="font-display text-2xl text-stone-800 mb-3">
                  {moment.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {moment.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final heart decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-300" />
            <Heart className="w-6 h-6 text-gold-400 fill-gold-400" aria-hidden="true" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
