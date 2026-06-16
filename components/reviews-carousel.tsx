"use client";

import { motion } from "framer-motion";
import { reviews } from "@/data/reviews";
import { Star } from "lucide-react";

export default function ReviewsCarousel() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Customer Reviews</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">What premium customers are saying</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass-card rounded-[28px] p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-surface">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-ink/70">{item.role}</p>
              </div>
            </div>
            <p className="mb-4 leading-7 text-ink/90">"{item.text}"</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: item.rating }).map((_, idx) => (
                <Star key={idx} className="h-4 w-4 text-gold" />
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
