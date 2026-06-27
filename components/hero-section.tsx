"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18),_transparent_28%),linear-gradient(180deg,_rgba(0,0,0,0.55),_rgba(0,0,0,0.92))]"></div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 text-center text-ink sm:px-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-gold/90">Luxury coffee delivery</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Premium Coffee Crafted For You</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/80 sm:text-xl">
            9 BAR is a cloud café built for modern coffee lovers. Rich blends, fast delivery, and elegant presentation with every order.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/menu">
            <Button>Order Now</Button>
          </Link>
          <Link href="/menu#menu-list">
            <Button variant="outline">View Menu</Button>
          </Link>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-[#111111]/70 p-6 backdrop-blur-xl">
            <p className="text-5xl font-semibold text-gold">20+</p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-ink/60">Premium blends</p>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#111111]/70 p-6 backdrop-blur-xl">
            <p className="text-5xl font-semibold text-gold">35m</p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-ink/60">Delivery radius</p>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#111111]/70 p-6 backdrop-blur-xl">
            <p className="text-5xl font-semibold text-gold">4.9</p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-ink/60">Average review</p>
          </div>
        </div>
      </div>
    </section>
  );
}
