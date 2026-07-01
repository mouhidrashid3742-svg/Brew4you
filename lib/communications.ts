function normalizePhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "").trim();
}

export function buildWhatsAppLink(phone: string, text?: string) {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return "";

  const encodedText = encodeURIComponent(text || "Hi 9 BAR, I'd like to place an order.");
  return `https://wa.me/${normalized}?text=${encodedText}`;
}
