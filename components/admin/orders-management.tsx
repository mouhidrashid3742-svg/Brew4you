"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, Phone, MessageSquare, Trash2 } from "lucide-react";

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  deliveryType: "pickup" | "delivery";
  deliveryAddress?: string;
  notes?: string;
  orderedAt: string;
  completedAt?: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">( "all");

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const url = statusFilter === "all" ? "/api/orders" : `/api/orders?status=${statusFilter}`;
      const response = await fetch(url);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });

      if (response.ok) {
        toast.success(`Order marked as ${newStatus}`);
        loadOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Error updating order");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Delete this order?")) return;

    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: orderId })
      });

      if (response.ok) {
        toast.success("Order deleted");
        loadOrders();
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error("Error deleting order");
    }
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppCustomer = (phone: string) => {
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  if (loading) {
    return <div className="text-center text-gold">Loading orders...</div>;
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="mt-2 text-ink-light">Track and manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gold/20 bg-gold/10 p-6">
          <p className="text-sm text-ink-light">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-gold">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-orange-400/20 bg-orange-400/10 p-6">
          <p className="text-sm text-orange-400">Pending</p>
          <p className="mt-2 text-3xl font-bold text-orange-400">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-6">
          <p className="text-sm text-green-400">Completed</p>
          <p className="mt-2 text-3xl font-bold text-green-400">{completedCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        {(["all", "pending", "completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-6 py-2 font-medium transition-all ${
              statusFilter === status
                ? "bg-gold text-ink"
                : "border border-gold/20 text-gold hover:bg-gold/10"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-gold/20 bg-ink/50 p-8 text-center">
            <p className="text-ink-light">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-gold/20 bg-ink/50 p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{order.customerName}</h3>
                  <p className="text-sm text-ink-light">
                    Order ID: {order._id.slice(-8)}
                  </p>
                  <p className="text-sm text-ink-light">
                    {new Date(order.orderedAt).toLocaleDateString()} at{" "}
                    {new Date(order.orderedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 ${
                    order.status === "pending"
                      ? "bg-orange-400/20 text-orange-400"
                      : order.status === "completed"
                      ? "bg-green-400/20 text-green-400"
                      : "bg-red-400/20 text-red-400"
                  }`}
                >
                  {order.status === "pending" ? (
                    <Clock size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 border-y border-gold/20 py-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-ink-light">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gold">
                      PKR {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gold/20 pt-2">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold text-gold">
                    PKR {order.totalPrice}
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="text-sm">
                <p className="text-ink-light">
                  {order.deliveryType === "delivery"
                    ? `📍 Delivery: ${order.deliveryAddress}`
                    : "🏪 Pickup"}
                </p>
                {order.notes && (
                  <p className="text-ink-light">📝 Notes: {order.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCallCustomer(order.customerPhone)}
                  className="flex items-center gap-2 rounded-lg bg-green-400/20 px-4 py-2 text-green-400 hover:bg-green-400/30 transition-colors"
                >
                  <Phone size={16} />
                  Call
                </button>
                <button
                  onClick={() => handleWhatsAppCustomer(order.customerPhone)}
                  className="flex items-center gap-2 rounded-lg bg-blue-400/20 px-4 py-2 text-blue-400 hover:bg-blue-400/30 transition-colors"
                >
                  <MessageSquare size={16} />
                  WhatsApp
                </button>

                {order.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange(order._id, "completed")}
                    className="flex items-center gap-2 rounded-lg bg-gold/20 px-4 py-2 text-gold hover:bg-gold/30 transition-colors"
                  >
                    <CheckCircle2 size={16} />
                    Mark Complete
                  </button>
                )}

                <button
                  onClick={() => handleDelete(order._id)}
                  className="flex items-center gap-2 rounded-lg bg-red-400/20 px-4 py-2 text-red-400 hover:bg-red-400/30 transition-colors ml-auto"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
