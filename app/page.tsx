"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroSection from "@/components/hero-section";
import ReviewsCarousel from "@/components/reviews-carousel";
import FaqSearch from "@/components/faq-search";
import FloatingActions from "@/components/floating-actions";
import ScrollTop from "@/components/scroll-top";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const products = data.products || [];
        setBestSellers(products.filter((item: MenuItem) => item.popular).slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };
    fetchMenu();
  }, []);
  return (
    <main className="relative overflow-hidden">
      <HeroSection />

      <section className="mx-auto max-w-7xl space-y-12 px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Why Choose Us</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">A minimalist experience with premium coffee values.</h2>
            <p className="max-w-2xl leading-8 text-ink/80">
              Brew4You blends luxury with speed. From bean selection to delivery, every step is designed for a seamless, premium journey.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Freshly roasted beans",
                "Experienced baristas",
                "Modern packaging",
                "Fast local delivery"
              ].map((item) => (
                <div key={item} className="glass-card rounded-[28px] p-5">
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111111]/70 p-6">
            <Image
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
              alt="Coffee experience"
              width={880}
              height={660}
              className="h-[420px] w-full rounded-[28px] object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {bestSellers.length === 0 ? (
              <p className="text-center text-ink/70">Loading bestsellers...</p>
            ) : (
              bestSellers.map((item) => (
                <div key={item._id || item.id} className="glass-card rounded-[32px] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold">{item.name}</p>
                      <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                    </div>
                    <span className="text-gold">PKR {item.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Beans", description: "Sourced from elite roasters and roasted just-in-time." },
              { title: "Brewing", description: "Precision drip, espresso, and cold brew crafted on-demand." },
              { title: "Delivery", description: "Brothers of speed ensure your cup arrives warm and intact." }
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-[32px] p-6">
                <p className="text-lg font-semibold text-gold">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-ink/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80"
          ].map((src) => (
            <div key={src} className="relative h-72 overflow-hidden rounded-[28px] border border-white/10 bg-[#111111]/80">
              <Image src={src} alt="Gallery image" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#080808] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <ReviewsCarousel />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <FaqSearch />
      </section>

      <section className="bg-[#090909] py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 text-center sm:px-8 lg:px-10">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Delivery time estimator</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Within 3–4 km of Eden Valley, expect premium delivery in under 35 minutes.</h2>
          <p className="max-w-3xl mx-auto leading-8 text-ink/70">
            Our optimized logistics ensure hot coffee reaches your door fresh and on time. Explore our menu and order now for the fastest cloud café experience in Faisalabad.
          </p>
          <Link href="/contact">
            <Button variant="secondary">Contact Our Team</Button>
          </Link>
        </div>
      </section>

      <FloatingActions />
      <ScrollTop />
    </main>
  );
}
