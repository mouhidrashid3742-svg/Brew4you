"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  intensity: number;
  favorite?: boolean;
  onFavorite?: () => void;
  onView?: () => void;
}

export default function ProductCard({ name, description, price, image, popular, intensity, favorite, onFavorite, onView }: ProductCardProps) {
  const handleOrder = (event: React.MouseEvent) => {
    event.stopPropagation();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP ?? "923000000000";
    const message = encodeURIComponent(`Hi Brew4You! I'd like to order:\n\n📍 ${name}\nPrice: PKR ${price}\n\nPlease confirm availability and delivery time.`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.article
      onClick={onView}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card overflow-hidden rounded-[32px] border border-white/10 cursor-pointer flex flex-col"
    >
      <div className="relative h-64 w-full overflow-hidden bg-black">
        <Image src={image} alt={name} fill className="object-cover opacity-90 transition duration-500 hover:scale-105" />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite?.();
          }}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0d0d0d]/80 text-ink transition hover:bg-[#1e1e1e]"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className={`text-lg ${favorite ? "text-gold" : "text-ink/70"}`}>{favorite ? "★" : "☆"}</span>
        </button>
      </div>
      <div className="flex-1 space-y-4 p-6 flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">{name}</h3>
          {popular ? <Badge>Popular</Badge> : null}
        </div>
        <p className="text-sm leading-7 text-ink/75">{description}</p>
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-4 text-sm text-ink/80">
            <span>{formatCurrency(price)}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: intensity }).map((_, idx) => (
                <Star key={idx} className="h-4 w-4 text-gold" />
              ))}
            </div>
          </div>
          <Button
            type="button"
            onClick={handleOrder}
            className="w-full bg-gold hover:bg-gold/90 text-[#0a0a0a] font-semibold"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Order Now
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
