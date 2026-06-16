"use client";

import { MessageCircle, Phone } from "lucide-react";

const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "923000000000"}?text=${encodeURIComponent("Hi Brew4You, I'd like to place an order.")}`;
const phoneNumber = process.env.NEXT_PUBLIC_PHONE ?? "+923000000000";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow transition hover:bg-[#20BA58] hover:scale-110"
        aria-label="Message Brew4You on WhatsApp"
        title="Order on WhatsApp"
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.271c-1.52.844-2.712 2.053-3.239 3.514-.88 2.367-.383 4.998 1.426 7.089 1.809 2.091 4.543 3.258 7.305 3.258 1.765 0 3.429-.428 4.961-1.274l3.576 1.178-.979-3.421c.855-1.456 1.337-3.159 1.337-4.98 0-4.763-3.824-8.636-8.536-8.636" />
        </svg>
      </a>
      <a
        href={`tel:${phoneNumber}`}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#1d1d1d] text-gold shadow-glow transition hover:bg-[#272727] hover:scale-110"
        aria-label="Call Brew4You"
        title="Call us now"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
