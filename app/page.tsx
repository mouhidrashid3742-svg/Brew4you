"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Clock, Coffee, Compass, Droplets, Leaf, Sparkles, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  popular?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.2 }
};

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);
  const heroRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-title", { y: 40, opacity: 0, duration: 0.95 })
      .from(".hero-copy", { y: 24, opacity: 0, duration: 0.75 }, "-=0.6")
      .from(".hero-cta", { y: 16, opacity: 0, stagger: 0.12, duration: 0.6 }, "-=0.45")
      .from(".hero-stat", { y: 14, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.35")
      .from(".hero-card", { x: 24, opacity: 0, duration: 0.8 }, "-=0.3");
  }, { scope: heroRef });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const products = data.products || [];
        setBestSellers(products.filter((item: MenuItem) => item.popular).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };
    fetchMenu();
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.14),transparent_34%),linear-gradient(135deg,#f8efe4_0%,#f1e3ce_100%)] pt-24 text-coffee-text">
      <section className="relative overflow-hidden px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pb-28 lg:pt-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-[#d2a26c]/20 blur-3xl" />
          <div className="absolute bottom-0 right-[-8%] h-80 w-80 rounded-full bg-[#2f1f16]/10 blur-3xl" />
        </div>

        <div ref={heroRef} className="luxury-container relative">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="luxury-shell overflow-hidden rounded-[34px] border border-white/70 bg-[#14110e]/95 p-8 shadow-[0_35px_140px_rgba(20,17,14,0.35)] sm:p-10 lg:p-14"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div className="text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6ab79]/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e8c493]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ritual Edition · Specialty Espresso
                </div>

                <h1 className="hero-title text-balance text-4xl font-semibold leading-[0.95] text-[#fcf7ef] sm:text-5xl lg:text-7xl">
                  Crafted for those who taste the difference.
                </h1>

                <p className="hero-copy mx-auto mt-6 max-w-2xl text-base leading-8 text-[#e8ddcf] sm:text-lg lg:mx-0">
                  At 9 BAR, every pour is shaped by precision, warmth, and a clear respect for the bean. We build a coffee ritual that feels as refined as it tastes.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                  <Link href="/menu" className="hero-cta luxury-button luxury-button-primary">
                    Explore The Menu <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="hero-cta luxury-button luxury-button-secondary border-[#e8c493] text-[#f5d8a9] hover:bg-[#e8c493] hover:text-[#17110e]">
                    Visit The Lounge
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "8.9/10", label: "Guest satisfaction" },
                    { value: "01", label: "Signature roast" },
                    { value: "24/7", label: "Delivery access" }
                  ].map((item) => (
                    <div key={item.label} className="hero-stat rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left backdrop-blur-sm">
                      <p className="text-xl font-semibold text-[#f7dcc4]">{item.value}</p>
                      <p className="mt-1 text-sm text-[#beb4a8]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                className="hero-card relative mx-auto w-full max-w-[430px]"
              >
                <div className="absolute inset-4 rounded-[30px] border border-[#d4a269]/30 bg-[#d4a269]/10 blur-2xl" />
                <div className="relative rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,247,236,0.18),rgba(94,61,40,0.04))] p-6 backdrop-blur-xl">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#e0b77b] bg-[#16110d]/90 text-5xl font-semibold text-[#f4d8af] shadow-[0_14px_45px_rgba(208,159,93,0.2)]">
                    9
                  </div>

                  <div className="mt-6 rounded-[24px] border border-[#e4c79a]/25 bg-[#11100d]/80 p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e0b77b]">
                      Tonight’s Signature
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold text-[#fdf5e8]">Golden Latte</h3>
                    <p className="mt-3 text-sm leading-7 text-[#d8cdb8]">
                      Velvety espresso, toasted oat milk, and a honeyed finish that lands softly on the palate.
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-[#f7e8d2]">
                      <span>Available now</span>
                      <span className="font-semibold text-[#e0b77b]">PKR 650</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="luxury-section px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="luxury-container">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="luxury-card rounded-[30px] border border-[#e6d3bd] bg-[#fcf7ef]/90 p-8 shadow-[0_20px_70px_rgba(98,66,38,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b0743d]">Our philosophy</p>
              <h2 className="mt-4 text-3xl text-[#24150d] sm:text-4xl">
                Every cup follows a ritual of precision.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#6f5846]">
                From bean sourcing to the final pour, we stay focused on balance, aroma, and a quietly luxurious experience that feels personal from the first sip.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Single-origin beans sourced with intention",
                  "Barista-led brewing with precise texture and temperature",
                  "A warm, design-led environment built to slow you down"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#ebdcc8] bg-white/70 px-4 py-3 text-sm text-[#624b3b]">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[#b0743d]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {[
                { icon: Compass, title: "Origin-led", description: "Distinctive beans selected for clarity, body, and finish." },
                { icon: Droplets, title: "Balanced extraction", description: "A polished cup designed to feel smooth from the first note to the last." },
                { icon: Star, title: "Memorable service", description: "Warm hospitality with thoughtful recommendations and detail." },
                { icon: Coffee, title: "Crafted daily", description: "Freshly prepared and served with care in every interaction." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} variants={fadeInUp} className="luxury-card rounded-[24px] border border-[#eddcc8] bg-[#fffdf9] p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7e4c7] text-[#a86e37]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl text-[#24150d]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6f5846]">{item.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="luxury-section px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[34px] border border-[#e7d8c0] bg-[linear-gradient(135deg,#fcf7ef_0%,#f4e4cc_100%)] p-8 shadow-[0_20px_70px_rgba(98,66,38,0.08)] sm:p-10 lg:p-12"
          >
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b0743d]">The experience</p>
                <h2 className="mt-4 text-3xl text-[#24150d] sm:text-4xl">
                  Quiet luxury, poured in layers.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#6f5846]">
                  From the first aroma to the final sip, every detail is shaped to feel calm, considered, and unmistakably elevated.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    "Slow mornings",
                    "Thoughtful pairings",
                    "Design-led comfort"
                  ].map((chip) => (
                    <span key={chip} className="rounded-full border border-[#e1c39b] bg-white/80 px-4 py-2 text-sm font-medium text-[#85522c]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "01 · Bean selection",
                    description: "Only coffees with distinctive character and clarity make the cut."
                  },
                  {
                    title: "02 · Precision brewing",
                    description: "Temperature, texture, and timing are tuned until every cup feels effortless."
                  },
                  {
                    title: "03 · A space to stay",
                    description: "The room is designed to slow you down and stay a while."
                  }
                ].map((item, index) => (
                  <div key={item.title} className="rounded-[22px] border border-[#ebdcc8] bg-[#fffdf9]/90 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7e4c7] text-sm font-semibold text-[#b0743d]">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg text-[#24150d]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[#6f5846]">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="luxury-section px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col gap-4 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b0743d]">House signature</p>
              <h2 className="mt-3 text-3xl text-[#24150d] sm:text-4xl">Seasonal favourites, served with intention.</h2>
            </div>
            <Link href="/menu" className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b0743d] transition hover:text-[#7e4a22]">
              View the full menu
            </Link>
          </motion.div>

          {bestSellers.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {bestSellers.map((drink) => (
                <motion.div key={drink._id || drink.id} variants={fadeInUp} className="luxury-card overflow-hidden rounded-[26px] border border-[#ebdcc8] bg-[#fffdf9] p-0 shadow-[0_18px_60px_rgba(98,66,38,0.08)]">
                  {drink.image && (
                    <div className="relative h-44 overflow-hidden">
                      <Image src={drink.image} alt={drink.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl text-[#24150d]">{drink.name}</h3>
                      <span className="rounded-full border border-[#e1c39b] bg-[#f7e4c7] px-3 py-1 text-sm font-semibold text-[#b0743d]">
                        PKR {drink.price}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#6f5846]">{drink.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-[24px] border border-[#ebdcc8] bg-[#fffdf9] p-10 text-center text-[#6f5846]">
              Loading our signature drinks…
            </div>
          )}
        </div>
      </section>

      <section className="luxury-section px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[34px] border border-[#e5c9a0] bg-[linear-gradient(135deg,#1c140f_0%,#463123_100%)] p-8 text-center text-[#f8e9d2] shadow-[0_24px_90px_rgba(27,16,11,0.28)] sm:p-10 lg:p-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#e0b77b]">From bean to bloom</p>
            <h2 className="mt-4 text-3xl text-[#fff6eb] sm:text-4xl lg:text-5xl">
              Ready for your next ritual?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#d8cdb8]">
              Step into a space built around calm, detail, and beautifully brewed coffee. We are here for your morning reset, your midday pause, and your evening unwind.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/menu" className="luxury-button luxury-button-primary">
                Order Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/contact" className="luxury-button luxury-button-secondary border-[#f1cf98] text-[#f9e7c2] hover:bg-[#f1cf98] hover:text-[#1f1712]">
                Find Us Nearby
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
