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
    googleMapsUrl: "https://share.google/rjcgcxurhw1VkiyJd",
    description: "Ceremonia religiosa",
  },
  reception: {
    time: "14:00",
    name: "Salones Media Luna",
    address: "Jumilla, Murcia",
    googleMapsUrl: "https://share.google/iifmPf3zsYS2whyzO",
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
    whatsapp: "", // Add WhatsApp number if needed
    email: "", // Add email if needed
  },
  social: {
    hashtag: "#AlbertoYCarmen2026",
  },
} as const;

export type WeddingConfig = typeof WEDDING_CONFIG;
