import Link from "next/link";
import { Heart } from "lucide-react";

const links = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070707] py-12 text-sm text-ink/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Brew4You</p>
          <p>Premium coffee delivery from Eden Valley, Faisalabad.</p>
          <p className="text-ink/60">© {new Date().getFullYear()} Brew4You. Crafted for the modern coffee lover.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-gold">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-ink/50">
        <span className="inline-flex items-center gap-2">
          Made with <Heart className="h-3 w-3 text-gold" /> for luxury coffee experiences.
        </span>
      </div>
    </footer>
  );
}
