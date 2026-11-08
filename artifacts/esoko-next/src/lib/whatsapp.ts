// Public business contact approved for the website, not a messaging API.
export const WHATSAPP_BUSINESS_NUMBER = "+233552783253";
export const WHATSAPP_GREETING =
  "Hello Esoko, I'd like to learn more about your products and services.";
export const WHATSAPP_CHAT_URL =
  `https://wa.me/${WHATSAPP_BUSINESS_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
