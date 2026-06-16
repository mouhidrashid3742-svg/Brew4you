"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, FileText, ShoppingBag } from "lucide-react";

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
          totalRevenue: totalRevenue,
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
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      
      <main className="ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/60">Welcome back! Here's your business overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-2">Total Products</p>
                  <p className="text-3xl font-bold text-gold">{stats.totalProducts}</p>
                </div>
                <ShoppingBag className="w-12 h-12 text-gold/30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400/10 to-green-400/5 border border-green-400/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-2">Active Items</p>
                  <p className="text-3xl font-bold text-green-400">{stats.activeItems}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400/30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-400/10 to-blue-400/5 border border-blue-400/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-2">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.totalOrders}</p>
                </div>
                <FileText className="w-12 h-12 text-blue-400/30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-400/10 to-purple-400/5 border border-purple-400/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-400">PKR {stats.totalRevenue}</p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-400/30" />
              </div>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Products</h2>
              <Button variant="secondary" size="sm">
                View All →
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-white/60">Loading data...</p>
              </div>
            ) : stats.recentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60">No products yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/70">Name</th>
                      <th className="text-left py-3 px-4 text-white/70">Category</th>
                      <th className="text-left py-3 px-4 text-white/70">Price</th>
                      <th className="text-left py-3 px-4 text-white/70">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentProducts.map((product) => (
                      <tr key={product._id} className="border-b border-white/10 hover:bg-white/5 transition">
                        <td className="py-3 px-4 text-white">{product.name}</td>
                        <td className="py-3 px-4 text-white/60">{product.category}</td>
                        <td className="py-3 px-4 text-gold font-semibold">PKR {product.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.available ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                            {product.available ? 'Available' : 'Hidden'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
