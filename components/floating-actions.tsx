"use client";

import { MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/communications";

const whatsappUrl = buildWhatsAppLink(process.env.NEXT_PUBLIC_WHATSAPP ?? "923205950705");
const phoneNumber = process.env.NEXT_PUBLIC_PHONE ?? "+923205950705";
const foodpandaUrl = process.env.NEXT_PUBLIC_FOODPANDA ?? "https://www.foodpanda.pk/";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow transition hover:bg-[#20BA58] hover:scale-110"
        aria-label="Message 9 BAR on WhatsApp"
        title="Order on WhatsApp"
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2.05 22l6.03-1.58C10.25 21.59 11.12 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-.89 0-1.76-.19-2.6-.55l-.18-.09-1.9.5.51-1.87-.1-.18C4.03 16.3 3 14.24 3 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.89-8.66c-.2-.1-1.19-.59-1.38-.65-.18-.07-.32-.11-.46.11-.13.22-.52.65-.63.78-.12.13-.23.15-.43.04-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.08-.41.08-.08.18-.21.27-.31.09-.11.12-.18.18-.3.07-.13.03-.24-.03-.34-.07-.1-.46-1.11-.63-1.52-.17-.41-.33-.35-.46-.36-.12-.01-.26-.02-.39-.02-.14 0-.36.05-.55.25-.19.2-.72.7-.72 1.71 0 1.01.74 1.98.84 2.12.1.14 1.4 2.14 3.4 2.99.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.18-.48 1.35-.95.16-.47.16-.87.11-.95-.04-.09-.16-.14-.33-.23z" />
        </svg>
      </a>
      <a
        href={foodpandaUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37] text-ink shadow-glow transition hover:bg-[#e5c24d] hover:scale-110"
        aria-label="Open Foodpanda"
        title="Order on Foodpanda"
      >
        <ShoppingBag className="h-6 w-6" />
      </a>
      <a
        href={`tel:${phoneNumber}`}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#1d1d1d] text-gold shadow-glow transition hover:bg-[#272727] hover:scale-110"
        aria-label="Call 9 BAR"
        title="Call us now"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
