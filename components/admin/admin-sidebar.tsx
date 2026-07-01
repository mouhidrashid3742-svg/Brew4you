"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Coffee, FileText, LogOut, Package, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: BarChart3, exact: true },
    { href: "/admin/menu", label: "Menu Management", icon: Coffee },
    { href: "/admin/blog", label: "Blog Articles", icon: FileText },
    { href: "/admin/orders", label: "Orders", icon: Package },
    { href: "/admin/settings", label: "Settings", icon: Settings }
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className={`fixed left-0 top-0 z-40 h-screen border-r border-[#d6ab79]/20 bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.16),transparent_34%),linear-gradient(135deg,#0f0c0b_0%,#1b1512_100%)] shadow-[14px_0_40px_rgba(12,8,6,0.25)] transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      <div className="flex items-center justify-between border-b border-[#d6ab79]/20 px-4 py-6">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b68349_0%,#e0b77b_100%)] shadow-[0_10px_25px_rgba(182,131,73,0.25)]">
              <Sparkles className="h-5 w-5 text-[#fff8eb]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-[#f3d8ae]">9 BAR</p>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b89b75]">Admin</p>
            </div>
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b68349_0%,#e0b77b_100%)] shadow-[0_10px_25px_rgba(182,131,73,0.25)]">
            <Sparkles className="h-5 w-5 text-[#fff8eb]" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d6ab79]/20 bg-white/5 text-[#f3d8ae] transition hover:bg-[#d6ab79]/15"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <nav className="space-y-2 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link key={item.href} href={item.href} title={!isOpen ? item.label : undefined}>
              <motion.div whileHover={{ x: 4, scale: 1.01 }} className="rounded-2xl">
                <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${active ? "bg-[#d6ab79]/15 text-[#f3d8ae] shadow-[inset_0_0_0_1px_rgba(214,171,121,0.2)]" : "text-[#d8cdb8] hover:bg-white/5 hover:text-[#fff8eb]"}`}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-[#d6ab79]/20 bg-white/5 px-4 py-3 text-[#d8cdb8] transition hover:bg-red-500/10 hover:text-red-300"
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
