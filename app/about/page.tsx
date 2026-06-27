import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
      <section className="grid gap-12 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">About 9 BAR</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Where exceptional coffee becomes a daily ritual.</h1>
          <p className="max-w-3xl leading-8 text-ink/75">
            9 BAR was founded to bring specialty coffee into a refined, effortless experience. Every roast is curated, every cup crafted, every delivery executed with care.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-[32px] p-6">
              <p className="font-semibold">Single-origin excellence</p>
              <p className="mt-3 text-sm text-ink/70">Our beans are sourced with precision for a layered, aromatic profile in every sip.</p>
            </div>
            <div className="glass-card rounded-[32px] p-6">
              <p className="font-semibold">Precision preparation</p>
              <p className="mt-3 text-sm text-ink/70">Every drink is made fresh by our expert team, designed to feel polished and inviting.</p>
            </div>
          </div>
          <Button variant="outline">Explore Our Menu</Button>
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111111]/70 p-6">
          <Image
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80"
            alt="About 9 BAR"
            width={900}
            height={900}
            className="h-full w-full rounded-[28px] object-cover"
          />
        </div>
      </section>
    </main>
  );
}
