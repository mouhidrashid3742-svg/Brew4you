"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export default function NavbarLuxury() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    setIsLoggedIn(!!userId);
    setUserName(name || "");
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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-[#d7b48a]/30 bg-[#f8efe4]/85 shadow-[0_10px_35px_rgba(34,24,16,0.08)] backdrop-blur-xl"
          : "border-transparent bg-[#f8efe4]/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-2xl bg-[#fff8eb]/10 shadow-[0_10px_30px_rgba(182,131,73,0.24)]">
            <Image src="/9bar.png" alt="9 BAR Logo" fill className="object-contain" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold tracking-[0.24em] text-[#2b2019]">9 BAR</h1>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8b6b4f]">Specialty Coffee</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm font-medium tracking-[0.2em] uppercase transition-colors ${
                pathname === item.href
                  ? "text-[#b0743d]"
                  : "text-[#6f5846] hover:text-[#2b2019]"
              }`}
            >
              {item.label}
              {pathname === item.href && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-[-8px] left-0 h-0.5 w-full rounded-full bg-[#b0743d]"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {isLoggedIn ? (
            <>
              <Link href="/cart" className="rounded-full p-2.5 text-[#2b2019] transition hover:bg-[#f1dfc5]">
                <ShoppingCart className="h-5 w-5" />
              </Link>

              <div className="flex items-center gap-3 rounded-full border border-[#e6d3bd] bg-white/70 px-3 py-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#2b2019]">{userName.split(" ")[0]}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6b4f]">Member</p>
                </div>
                <Link href="/account" className="rounded-full p-2 text-[#2b2019] transition hover:bg-[#f1dfc5]">
                  <User className="h-4 w-4" />
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full border border-[#b0743d] px-5 py-2 text-sm font-semibold text-[#b0743d] transition hover:bg-[#b0743d] hover:text-[#fff8eb]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="rounded-full bg-[#b0743d] px-5 py-2.5 text-sm font-semibold text-[#fff8eb] transition hover:bg-[#8e562a]">
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-full p-2.5 text-[#2b2019] transition hover:bg-[#f1dfc5] lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-[#e6d3bd] bg-[#f4e8da] lg:hidden"
        >
          <div className="flex items-center gap-3 border-b border-[#e6d3bd] px-4 py-4 sm:px-6">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-2xl bg-[#fff8eb]/10 shadow-[0_10px_30px_rgba(182,131,73,0.24)]">
              <Image src="/9bar.png" alt="9 BAR Logo" fill className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2b2019]">9 BAR</p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#8b6b4f]">Specialty Coffee</p>
            </div>
          </div>
          <div className="space-y-4 px-4 py-6 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium uppercase tracking-[0.2em] transition-colors ${
                  pathname === item.href ? "text-[#b0743d]" : "text-[#6f5846] hover:text-[#2b2019]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="space-y-3 border-t border-[#e6d3bd] pt-4">
              {isLoggedIn ? (
                <>
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-[#2b2019]">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </Link>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-[#2b2019]">
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-full border border-[#b0743d] px-4 py-2.5 text-sm font-semibold text-[#b0743d] transition hover:bg-[#b0743d] hover:text-[#fff8eb]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block w-full rounded-full bg-[#b0743d] px-4 py-2.5 text-center text-sm font-semibold text-[#fff8eb]">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
