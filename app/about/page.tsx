import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
      <section className="grid gap-12 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">About Brew4You</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">A premium story rooted in craft and speed.</h1>
          <p className="max-w-3xl leading-8 text-ink/75">
            Brew4You began with a simple idea: make luxury coffee approachable, fast, and unforgettable. Each cup starts from freshly roasted beans and ends at your door.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-[32px] p-6">
              <p className="font-semibold">Premium ingredients</p>
              <p className="mt-3 text-sm text-ink/70">Sourced from trusted farms and roasted in small batches for rich aroma.</p>
            </div>
            <div className="glass-card rounded-[32px] p-6">
              <p className="font-semibold">Handcrafted coffee</p>
              <p className="mt-3 text-sm text-ink/70">Each drink is made fresh by our expert team for a flawless coffee moment.</p>
            </div>
          </div>
          <Button variant="outline">Explore Our Menu</Button>
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111111]/70 p-6">
          <Image
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80"
            alt="About Brew4You"
            width={900}
            height={900}
            className="h-full w-full rounded-[28px] object-cover"
          />
        </div>
      </section>
    </main>
  );
}
