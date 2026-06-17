"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Clock, CheckCircle, Truck, Home, ArrowLeft } from "lucide-react";

interface OrderItem {
  itemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  subtotal: number;
}

interface TrackingUpdate {
  status: string;
  timestamp: string;
  message: string;
}

interface Order {
  orderId: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  estimatedDeliveryTime: string;
  trackingUpdates: TrackingUpdate[];
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/track`);
      const data = await res.json();
      if (data.success) {
        setOrder(data);
      }
    } catch (error) {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
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

  if (!order) {
    return (
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-6 py-8 text-center">
          <p className="text-ink/70 mb-6">Order not found</p>
          <Link href="/">
            <Button className="bg-gold hover:bg-gold/90 text-surface">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const statusSteps = [
    { status: "pending", label: "Order Received", icon: Clock },
    { status: "brewing", label: "Brewing", icon: Clock },
    { status: "ready", label: "Ready for Pickup", icon: CheckCircle },
    { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { status: "delivered", label: "Delivered", icon: Home }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <Link href="/" className="inline-block mb-6">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
        <p className="text-ink/70 mb-8">Order ID: <span className="font-mono text-gold">{order.orderId}</span></p>

        {/* Status Timeline */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="font-bold mb-6">Status</h2>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                        isCompleted
                          ? "bg-gold text-surface"
                          : "bg-white/10 text-ink/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`h-8 w-1 my-2 transition ${
                          isCompleted ? "bg-gold" : "bg-white/10"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="pt-1">
                    <p
                      className={`font-semibold transition ${
                        isCurrent ? "text-gold" : isCompleted ? "text-ink" : "text-ink/50"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-gold mt-1">In Progress</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDeliveryTime && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <p className="text-ink/70 text-sm mb-1">Estimated Delivery</p>
            <p className="text-2xl font-bold text-gold">
              {new Date(order.estimatedDeliveryTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div className="glass-card rounded-2xl p-6 mb-8 border border-gold/20">
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">ORDER RECEIPT</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                order.status === "delivered" 
                  ? "bg-green-500/20 text-green-500"
                  : order.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-blue-500/20 text-blue-500"
              }`}>
                {order.status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </span>
            </div>
            <p className="text-sm text-ink/60 mt-3">Order ID: <span className="font-mono text-gold font-bold">{order.orderId}</span></p>
          </div>

          {/* Items */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <h3 className="font-bold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-ink/60 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gold">PKR {item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-6 pb-6 border-b border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Subtotal</span>
              <span className="font-semibold">PKR {order.items.reduce((sum, i) => sum + i.subtotal, 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Tax (17% GST)</span>
              <span className="font-semibold">PKR {Math.round(order.items.reduce((sum, i) => sum + i.subtotal, 0) * 0.17)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/70">Delivery Fee</span>
              <span className="font-semibold">
                {order.totalAmount < 5000 ? `PKR 200` : `FREE`}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gold/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">TOTAL AMOUNT</span>
              <span className="text-2xl font-bold text-gold">PKR {order.totalAmount}</span>
            </div>
            <p className="text-xs text-ink/60 mt-2">Payment Method: Cash on Delivery</p>
          </div>
        </div>

        {/* Activity Log */}
        {order.trackingUpdates && order.trackingUpdates.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-bold mb-4">Activity Log</h2>
            <div className="space-y-3">
              {[...order.trackingUpdates].reverse().map((update, idx) => (
                <div key={idx} className="text-sm border-l-2 border-gold/30 pl-4">
                  <p className="font-semibold text-ink/80 capitalize">{update.status}</p>
                  <p className="text-ink/60">{update.message}</p>
                  <p className="text-xs text-ink/40 mt-1">
                    {new Date(update.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.status === "delivered" && (
          <Link href="/" className="block mt-8">
            <Button className="w-full bg-gold hover:bg-gold/90 text-surface">
              Order Again
            </Button>
          </Link>
        )}
      </div>
    </main>
  );
}
