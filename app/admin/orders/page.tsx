"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Trash2, Phone, MapPin } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  deliveryType: "pickup" | "delivery";
  deliveryAddress?: string;
  notes?: string;
  orderedAt: string;
  completedAt?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [lastOrderId, setLastOrderId] = useState<string>("");

  useEffect(() => {
    loadOrders();
    // Poll for new orders every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      const newOrders = data.orders || [];
      
      // Check for new pending order and play notification sound
      const newPendingOrder = newOrders.find((o: Order) => o.status === "pending" && o._id !== lastOrderId);
      if (newPendingOrder && lastOrderId) {
        playNotificationSound();
      }
      
      if (newOrders.length > 0) {
        setLastOrderId(newOrders[0]._id);
      }
      
      setOrders(newOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationSound = () => {
    // Create a simple ding sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for a pleasant ding sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency for a pleasant ding sound (E4 note: 329.63 Hz)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.5);
    
    // Set volume envelope
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: orderId,
          status: newStatus
        })
      });

      if (!res.ok) throw new Error("Failed to update order");

      const data = await res.json();
      setOrders(orders.map(o => o._id === orderId ? data.order : o));
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update order");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Delete this order?")) return;

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: orderId })
      });

      if (!res.ok) throw new Error("Failed to delete order");

      setOrders(orders.filter(o => o._id !== orderId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete order");
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-400/10 text-yellow-400";
      case "completed":
        return "bg-green-400/10 text-green-400";
      case "cancelled":
        return "bg-red-400/10 text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />

      <main className="ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
            <p className="text-white/60">View and manage customer orders</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            {(["all", "pending", "completed", "cancelled"] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? "bg-gold text-black"
                    : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && ` (${orders.filter(o => o.status === status).length})`}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/60">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order._id}
                  className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{order.customerName}</h3>
                      <p className="text-sm text-white/60">
                        Ordered {new Date(order.orderedAt).toLocaleDateString()} at {new Date(order.orderedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Items */}
                    <div>
                      <p className="text-white/70 text-sm mb-3">Items</p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-white/60">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gold">PKR {item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <p className="text-white/70 text-sm mb-3">Contact Info</p>
                      <div className="space-y-2">
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex items-center gap-2 text-gold hover:text-gold/70 transition"
                          title="Call customer"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="font-mono">{order.customerPhone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=Hi! Your order is being prepared. Order ID: ${order._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-[#25D366] hover:text-[#20BA58] transition"
                          title="Send WhatsApp message"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2.05 22l6.03-1.58C10.25 21.59 11.12 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-.89 0-1.76-.19-2.6-.55l-.18-.09-1.9.5.51-1.87-.1-.18C4.03 16.3 3 14.24 3 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.89-8.66c-.2-.1-1.19-.59-1.38-.65-.18-.07-.32-.11-.46.11-.13.22-.52.65-.63.78-.12.13-.23.15-.43.04-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.08-.41.08-.08.18-.21.27-.31.09-.11.12-.18.18-.3.07-.13.03-.24-.03-.34-.07-.1-.46-1.11-.63-1.52-.17-.41-.33-.35-.46-.36-.12-.01-.26-.02-.39-.02-.14 0-.36.05-.55.25-.19.2-.72.7-.72 1.71 0 1.01.74 1.98.84 2.12.1.14 1.4 2.14 3.4 2.99.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.18-.48 1.35-.95.16-.47.16-.87.11-.95-.04-.09-.16-.14-.33-.23z" />
                          </svg>
                          <span>Message</span>
                        </a>
                      </div>

                      {order.deliveryType === "delivery" && order.deliveryAddress && (
                        <div className="flex items-start gap-2 text-white/70 text-sm mt-4 pt-4 border-t border-white/10">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      )}

                      {order.notes && (
                        <p className="text-sm text-white/60 mt-4 pt-4 border-t border-white/10">
                          <strong>Notes:</strong> {order.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mb-6 pb-6 border-b border-white/10 flex justify-between items-center">
                    <span className="text-white/70 font-medium">Total:</span>
                    <span className="text-2xl font-bold text-gold">PKR {order.totalPrice}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 flex-wrap">
                    {order.status === "pending" && (
                      <button
                        onClick={() => updateStatus(order._id, "completed")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition font-medium text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Completed
                      </button>
                    )}

                    {order.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition font-medium text-sm"
                      >
                        Cancel Order
                      </button>
                    )}

                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition font-medium text-sm ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
