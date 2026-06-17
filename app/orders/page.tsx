"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Clock, AlertCircle, ArrowLeft } from "lucide-react";

interface Order {
  orderId: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export default function OrdersListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/auth/login");
      return;
    }
    setUserId(id);
    fetchOrders(id);
  }, [router]);

  const fetchOrders = async (id: string) => {
    try {
      const res = await fetch(`/api/orders?userId=${id}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "brewing":
        return "text-blue-500";
      case "ready":
        return "text-purple-500";
      case "out_for_delivery":
        return "text-orange-500";
      case "delivered":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-ink/70";
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface pt-24">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-ink/40 mb-4" />
            <p className="text-ink/70 mb-6">No orders yet. Start ordering now!</p>
            <Link href="/menu">
              <Button className="bg-gold hover:bg-gold/90 text-surface">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.orderId} href={`/orders/${order.orderId}`}>
                <div className="glass-card rounded-2xl p-4 hover:border-gold/50 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-sm text-gold font-semibold">
                        {order.orderId}
                      </p>
                      <p className="text-xs text-ink/60 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gold">
                      PKR {order.totalAmount}
                    </p>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-1">
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="text-xs bg-white/5 text-ink/70 px-2 py-1 rounded">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                    {order.items && order.items.length > 2 && (
                      <span className="text-xs bg-white/5 text-ink/70 px-2 py-1 rounded">
                        +{order.items.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold capitalize ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusLabel(order.orderStatus)}
                    </span>
                    <span className="text-xs text-ink/60">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
