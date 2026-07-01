"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, FileText, ShoppingBag, Sparkles } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  activeItems: number;
  totalOrders: number;
  totalRevenue: number;
  recentProducts: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders")
        ]);

        if (!productsRes.ok || !ordersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const products = productsData.products || [];
        const orders = ordersData.orders || [];

        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

        setStats({
          totalProducts: products.length,
          activeItems: products.filter((p: any) => p.available).length,
          totalOrders: orders.length,
          totalRevenue,
          recentProducts: products.slice(0, 5)
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(184,138,90,0.14),transparent_34%),linear-gradient(135deg,#f8efe4_0%,#f1e3ce_100%)]">
      <AdminSidebar />

      <main className="ml-64">
        <div className="p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-8 overflow-hidden rounded-[34px] border border-[#e6d3bd] bg-[linear-gradient(135deg,#fcf7ef_0%,#f4e4cc_100%)] p-8 shadow-[0_20px_70px_rgba(98,66,38,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d6ab79]/30 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#b0743d]">
                  <Sparkles className="h-3.5 w-3.5" />
                  9 BAR control room
                </div>
                <h1 className="text-3xl font-semibold text-[#24150d] sm:text-4xl">Dashboard</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5846]">Welcome back. Keep your menu, orders, and storefront pulse aligned from one refined command center.</p>
              </div>
              <div className="rounded-2xl border border-[#e1c39b] bg-white/70 px-4 py-3 text-sm text-[#85522c]">
                Live overview · {stats.totalOrders} orders tracked
              </div>
            </div>
          </motion.div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Total Products", value: stats.totalProducts, icon: ShoppingBag, tone: "text-[#b0743d]" },
              { title: "Active Items", value: stats.activeItems, icon: TrendingUp, tone: "text-emerald-600" },
              { title: "Total Orders", value: stats.totalOrders, icon: FileText, tone: "text-sky-600" },
              { title: "Total Revenue", value: `PKR ${stats.totalRevenue}`, icon: DollarSign, tone: "text-violet-600" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.35 }} className="rounded-[24px] border border-[#e6d3bd] bg-[#fffdf9]/90 p-6 shadow-[0_20px_60px_rgba(98,66,38,0.06)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[#6f5846]">{item.title}</p>
                      <p className={`mt-3 text-3xl font-semibold ${item.tone}`}>{item.value}</p>
                    </div>
                    <div className="rounded-2xl bg-[#f7e4c7] p-3 text-[#b0743d]">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-[30px] border border-[#e6d3bd] bg-[#fffdf9]/90 p-6 shadow-[0_20px_70px_rgba(98,66,38,0.08)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#24150d]">Recent Products</h2>
                <p className="mt-1 text-sm text-[#6f5846]">The latest offerings you’ve published to the storefront.</p>
              </div>
              <Button className="rounded-full border border-[#d6ab79]/30 bg-[#f7e4c7] text-[#85522c] hover:bg-[#e9c997]">
                View All →
              </Button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-[#6f5846]">Loading data...</div>
            ) : stats.recentProducts.length === 0 ? (
              <div className="py-12 text-center text-[#6f5846]">No products yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#ebdcc8] text-left text-[#8b6b4f]">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentProducts.map((product) => (
                      <tr key={product._id} className="border-b border-[#f2e6d7] transition hover:bg-[#fdf7eb]">
                        <td className="px-4 py-3 font-medium text-[#24150d]">{product.name}</td>
                        <td className="px-4 py-3 text-[#6f5846]">{product.category}</td>
                        <td className="px-4 py-3 font-semibold text-[#b0743d]">PKR {product.price}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.available ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {product.available ? "Available" : "Hidden"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
