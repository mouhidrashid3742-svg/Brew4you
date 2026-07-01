"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, LogOut, BarChart3, Coffee, FileText, Settings as SettingsIcon, Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard", id: "dashboard" },
    { href: "/admin/menu", icon: Coffee, label: "Menu Items", id: "menu" },
    { href: "/admin/blog", icon: FileText, label: "Blog Posts", id: "blog" },
    { href: "/admin/orders", icon: Package, label: "Orders", id: "orders" },
    { href: "/admin/settings", icon: SettingsIcon, label: "Settings", id: "settings" }
  ];

  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.14),transparent_34%),linear-gradient(135deg,#f8efe4_0%,#f1e3ce_100%)] text-[#2b2019]">
      <aside className={`flex flex-col border-r border-[#d6ab79]/20 bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.18),transparent_34%),linear-gradient(135deg,#0f0c0b_0%,#1b1512_100%)] shadow-[14px_0_40px_rgba(12,8,6,0.2)] transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="flex items-center justify-between border-b border-[#d6ab79]/20 px-4 py-6">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b68349_0%,#e0b77b_100%)]">
                <Sparkles className="h-5 w-5 text-[#fff8eb]" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-[#f3d8ae]">9 BAR</p>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b89b75]">Admin</p>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b68349_0%,#e0b77b_100%)]">
              <Sparkles className="h-5 w-5 text-[#fff8eb]" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full border border-[#d6ab79]/20 bg-white/5 p-2 text-[#f3d8ae] transition hover:bg-[#d6ab79]/15">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-6">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <motion.div whileHover={{ x: 4, scale: 1.01 }} className="rounded-2xl">
                <button className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${currentPage === item.id ? "bg-[#d6ab79]/15 text-[#f3d8ae] shadow-[inset_0_0_0_1px_rgba(214,171,121,0.2)]" : "text-[#d8cdb8] hover:bg-white/5 hover:text-[#fff8eb]"}`}>
                  <item.icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#d6ab79]/20 px-3 py-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl border border-[#d6ab79]/20 bg-white/5 px-4 py-3 text-[#d8cdb8] transition hover:bg-red-500/10 hover:text-red-300">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
