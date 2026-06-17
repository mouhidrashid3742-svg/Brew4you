"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, Moon, Phone, Search, Sun, Truck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Build Your Own", href: "/build-your-own" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-xl",
        scrolled ? "bg-surface/95 shadow-xl shadow-black/10" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-heading text-xl font-semibold tracking-[0.3em] text-ink uppercase">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src="/icon.svg"
              alt="Brew4You Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>
          Brew4You
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition text-sm font-medium uppercase tracking-[0.18em]",
                pathname === item.href ? "text-gold" : "text-ink/80 hover:text-gold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE ?? "+923000000000"}`}
            className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium transition hover:bg-gold/20 text-gold"
            aria-label="Call Brew4You"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <DarkModeToggle />
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111111]/90 text-ink lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-surface/95 lg:hidden">
          <div className="flex flex-col gap-4 px-6 py-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium uppercase tracking-[0.18em] text-ink/90">
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between">
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE ?? "+923000000000"}`}
                className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium transition hover:bg-gold/20 text-gold"
                aria-label="Call Brew4You"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
