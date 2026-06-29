"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ShoppingCart, User, LogOut } from "lucide-react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

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
              alt="9 BAR Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>
          9 BAR
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
            href={`tel:${process.env.NEXT_PUBLIC_PHONE ?? "+923205950705"}`}
            className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium transition hover:bg-gold/20 text-gold"
            aria-label="Call 9 BAR"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>

          {isLoggedIn ? (
            <>
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0 border-gold/20 hover:bg-gold/10"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="h-4 w-4 text-gold" />
                </Button>
              </Link>
              <Link href="/account">
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0 border-gold/20 hover:bg-gold/10"
                  aria-label="Account"
                >
                  <User className="h-4 w-4 text-gold" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-10 w-10 p-0 border-red-500/20 hover:bg-red-500/10"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 text-red-500" />
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-gold hover:bg-gold/90 text-surface">Login</Button>
            </Link>
          )}

          <DarkModeToggle />
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111111]/90 text-ink lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-surface/95 lg:hidden">
          <div className="flex flex-col gap-4 px-6 py-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium uppercase tracking-[0.18em] text-ink/90" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE ?? "+923205950705"}`}
                className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium transition hover:bg-gold/20 text-gold"
                aria-label="Call 9 BAR"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>

              {isLoggedIn ? (
                <>
                  <Link href="/cart" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-gold/20 hover:bg-gold/30 text-gold border-0">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart
                    </Button>
                  </Link>
                  <Link href="/account" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-gold/20 hover:bg-gold/30 text-gold border-0">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 border-0"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gold hover:bg-gold/90 text-surface">Login</Button>
                </Link>
              )}

              <DarkModeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
