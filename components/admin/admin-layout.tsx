"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, BarChart3, Coffee, FileText, Settings as SettingsIcon, Package } from "lucide-react";

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
    <div className="flex h-screen bg-ink text-ink-light">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-gold/20 bg-gradient-to-b from-ink to-ink/95 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gold/20 px-4 py-6">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Image
                src="/icon.svg"
                alt="9 BAR Logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <h1 className="text-xl font-bold text-gold">9 BAR</h1>
            </div>
          )}
          {!sidebarOpen && (
            <Image
              src="/icon.svg"
              alt="9 BAR Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gold/10 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-2 py-6">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <button
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-gold/20 text-gold"
                    : "text-ink-light hover:bg-gold/10"
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gold/20 px-2 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition-colors hover:bg-red-400/10"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
