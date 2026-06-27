"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-coffee-card/95 shadow-luxury backdrop-blur-md"
          : "bg-coffee-card shadow-luxury"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-coffee-bronze to-coffee-gold rounded-lg flex items-center justify-center">
              <span className="font-heading text-white text-lg font-bold">9</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-lg font-bold text-coffee-text tracking-wider">
              9 BAR
            </h1>
            <p className="text-xs text-coffee-text-secondary">Specialty Coffee</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium tracking-wide transition-colors relative group ${
                pathname === item.href
                  ? "text-coffee-bronze"
                  : "text-coffee-text-secondary hover:text-coffee-text"
              }`}
            >
              {item.label}
              {pathname === item.href && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-coffee-bronze"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link
                href="/cart"
                className="p-2.5 rounded-full hover:bg-coffee-light transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5 text-coffee-text" />
              </Link>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-coffee-text">
                    {userName.split(" ")[0]}
                  </p>
                  <p className="text-xs text-coffee-text-secondary">Member</p>
                </div>
                <Link href="/account" className="p-2.5 rounded-full hover:bg-coffee-light transition-colors">
                  <User className="w-5 h-5 text-coffee-text" />
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-full border border-coffee-bronze text-coffee-bronze hover:bg-coffee-bronze hover:text-coffee-cream transition-all text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-6 py-2.5 rounded-full bg-coffee-bronze text-coffee-cream hover:bg-coffee-dark hover:shadow-luxury transition-all text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2.5 rounded-full hover:bg-coffee-light transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-coffee-text" />
          ) : (
            <Menu className="w-5 h-5 text-coffee-text" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden border-t border-coffee-border bg-coffee-light"
        >
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-coffee-bronze"
                    : "text-coffee-text-secondary hover:text-coffee-text"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-coffee-border space-y-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-coffee-text"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-coffee-text"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-full border border-coffee-bronze text-coffee-bronze hover:bg-coffee-bronze hover:text-coffee-cream transition-all text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full px-4 py-2.5 rounded-full bg-coffee-bronze text-coffee-cream text-center text-sm font-medium"
                >
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
