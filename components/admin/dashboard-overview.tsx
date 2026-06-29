"use client";

import { useEffect, useState } from "react";
import { Activity, Coffee, FileText, ShoppingCart } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalBlogs: number;
  pendingOrders: number;
  totalOrders: number;
  topProducts: Array<{
    name: string;
    price: number;
    views: number;
  }>;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, blogsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/blogs"),
        fetch("/api/orders?status=pending")
      ]);

      const products = await productsRes.json();
      const blogs = await blogsRes.json();
      const orders = await ordersRes.json();

      const allOrdersRes = await fetch("/api/orders");
      const allOrders = await allOrdersRes.json();

      setStats({
        totalProducts: products.products?.length || 0,
        totalBlogs: blogs.blogs?.length || 0,
        pendingOrders: orders.orders?.length || 0,
        totalOrders: allOrders.orders?.length || 0,
        topProducts: (products.products || [])
          .sort((a: any, b: any) => b.views - a.views)
          .slice(0, 5)
          .map((p: any) => ({
            name: p.name,
            price: p.price,
            views: p.views
          }))
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold mx-auto"></div>
          <p className="text-gold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome to Admin Dashboard</h1>
        <p className="mt-2 text-ink-light">Manage your 9 BAR coffee business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/20 to-gold/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-light">Menu Items</p>
              <p className="mt-3 text-3xl font-bold text-gold">{stats.totalProducts}</p>
            </div>
            <Coffee className="h-12 w-12 text-gold/30" />
          </div>
        </div>

        <div className="rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-400/20 to-blue-400/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-400">Blog Articles</p>
              <p className="mt-3 text-3xl font-bold text-blue-400">{stats.totalBlogs}</p>
            </div>
            <FileText className="h-12 w-12 text-blue-400/30" />
          </div>
        </div>

        <div className="rounded-xl border border-orange-400/20 bg-gradient-to-br from-orange-400/20 to-orange-400/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-400">Pending Orders</p>
              <p className="mt-3 text-3xl font-bold text-orange-400">{stats.pendingOrders}</p>
            </div>
            <ShoppingCart className="h-12 w-12 text-orange-400/30" />
          </div>
        </div>

        <div className="rounded-xl border border-green-400/20 bg-gradient-to-br from-green-400/20 to-green-400/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-400">Total Orders</p>
              <p className="mt-3 text-3xl font-bold text-green-400">{stats.totalOrders}</p>
            </div>
            <Activity className="h-12 w-12 text-green-400/30" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gold/20 bg-ink/50 p-6">
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/admin/menu"
            className="rounded-lg border border-gold/20 bg-gold/10 p-4 hover:bg-gold/20 transition-colors"
          >
            <p className="font-bold text-gold">➕ Add New Coffee Item</p>
            <p className="text-sm text-ink-light">Add product to menu</p>
          </a>
          <a
            href="/admin/blog"
            className="rounded-lg border border-blue-400/20 bg-blue-400/10 p-4 hover:bg-blue-400/20 transition-colors"
          >
            <p className="font-bold text-blue-400">📝 Write Blog Article</p>
            <p className="text-sm text-ink-light">Share coffee tips & stories</p>
          </a>
          <a
            href="/admin/orders"
            className="rounded-lg border border-orange-400/20 bg-orange-400/10 p-4 hover:bg-orange-400/20 transition-colors"
          >
            <p className="font-bold text-orange-400">📦 View Orders</p>
            <p className="text-sm text-ink-light">Check pending orders</p>
          </a>
          <a
            href="/admin/settings"
            className="rounded-lg border border-green-400/20 bg-green-400/10 p-4 hover:bg-green-400/20 transition-colors"
          >
            <p className="font-bold text-green-400">⚙️ Settings</p>
            <p className="text-sm text-ink-light">Configure business info</p>
          </a>
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-xl border border-gold/20 bg-ink/50 p-6">
        <h2 className="mb-4 text-xl font-bold">Most Viewed Items</h2>
        <div className="space-y-3">
          {stats.topProducts.length === 0 ? (
            <p className="text-ink-light">No products yet</p>
          ) : (
            stats.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gold/20 pb-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-ink-light">PKR {product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gold">{product.views}</p>
                  <p className="text-xs text-ink-light">views</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-gold/20 bg-gold/10 p-6">
        <h3 className="mb-4 font-bold text-gold">💡 Admin Tips</h3>
        <ul className="space-y-2 text-sm text-ink-light">
          <li>✓ Update prices regularly to keep menu current</li>
          <li>✓ Upload high-quality images for better engagement</li>
          <li>✓ Mark popular items to help customers find favorites</li>
          <li>✓ Write blog articles to build customer engagement</li>
          <li>✓ Check orders daily and update customers</li>
          <li>✓ Keep business hours updated during holidays</li>
        </ul>
      </div>
    </div>
  );
}
