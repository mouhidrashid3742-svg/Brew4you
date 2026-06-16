"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Coffee, FileText, LogOut, Package, Settings } from "lucide-react";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    document.cookie = "brew4you_admin=; max-age=0; path=/";
    router.push("/admin/login");
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: BarChart3,
      exact: true
    },
    {
      href: "/admin/menu",
      label: "Menu Management",
      icon: Coffee
    },
    {
      href: "/admin/blog",
      label: "Blog Articles",
      icon: FileText
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: Package
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings
    }
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-white/10 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} pt-20 z-40`}>
      <nav className="space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "bg-gold/10 text-gold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-all"
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Sidebar Toggle - appears on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden absolute top-6 right-[-12px] w-6 h-6 bg-gold rounded-full items-center justify-center text-black sm:flex"
      >
        {isOpen ? "←" : "→"}
      </button>
    </aside>
  );
}
