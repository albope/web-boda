export const WEDDING_CONFIG = {
  couple: {
    partner1: "Alberto",
    partner2: "Carmen",
  },
  date: {
    iso: "2026-11-14T12:00:00+01:00",
    display: "14 de Noviembre de 2026",
    day: "Sábado",
    year: 2026,
    month: 11,
    dayOfMonth: 14,
    hour: 12,
    minute: 0,
  },
  ceremony: {
    time: "12:00",
    name: "Iglesia Mayor de Santiago",
    address: "Plaza de Arriba, Jumilla, Murcia",
    googleMapsUrl: "https://maps.app.goo.gl/BqBRH6r7kyTrATXc9",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-1.3344955!3d38.4760252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd640f870cf0f54b%3A0x89bd09ae5ff43d4e!2sIglesia%20Mayor%20de%20Santiago!5e0!3m2!1ses!2ses",
    description: "Ceremonia religiosa",
  },
  reception: {
    time: "14:00",
    name: "Salones Media Luna",
    address: "Jumilla, Murcia",
    googleMapsUrl: "https://maps.app.goo.gl/yksXpNXYix6XpaAd7",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d-1.3154651!3d38.5030819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6405bc8e82b7d1%3A0xc7f82bd2b921638a!2sMedia%20Luna!5e0!3m2!1ses!2ses",
    description: "Banquete y celebración",
  },
  schedule: [
    {
      time: "12:00",
      event: "Ceremonia religiosa",
      location: "Iglesia Mayor de Santiago",
      icon: "church",
    },
    {
      time: "13:30",
      event: "Aperitivo de bienvenida",
      location: "Salones Media Luna",
      icon: "wine",
    },
    {
      time: "15:00",
      event: "Banquete",
      location: "Salones Media Luna",
      icon: "utensils",
    },
    {
      time: "20:00",
      event: "Fiesta y baile",
      location: "Salones Media Luna",
      icon: "music",
    },
  ],
  dressCode: {
    title: "Código de Vestimenta",
    style: "Elegante / Cocktail",
    description:
      "Sugerimos tonos elegantes y sobrios. Se ruega evitar el color blanco.",
  },
  location: {
    city: "Jumilla",
    region: "Murcia",
    country: "España",
  },
  contact: {
    alberto: {
      name: "Alberto",
      whatsapp: "34676110159",
      email: "albertobort@gmail.com",
    },
    carmen: {
      name: "Carmen",
      whatsapp: "34647440295",
      email: "cpalaocruz@gmail.com",
    },
  },
  social: {
    hashtag: "#AlbertoYCarmen2026",
  },
} as const;

export type WeddingConfig = typeof WEDDING_CONFIG;
