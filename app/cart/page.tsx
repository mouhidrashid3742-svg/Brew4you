"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";

interface CartItem {
  itemId: string;
  name: string;
  basePrice: number;
  customizations: Record<string, any>;
  quantity: number;
  subtotal: number;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  totalAmount: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }
    setUserId(id);
    fetchCart(id);
  }, [router]);

  const fetchCart = async (id: string) => {
    try {
      const res = await fetch(`/api/cart?userId=${id}`);
      const data = await res.json();
      setCart(data.cart);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (index: number, quantity: number) => {
    if (!cart || !userId) return;

    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemIndex: index, quantity })
      });
      const data = await res.json();
      setCart(data.cart);
      if (quantity === 0) {
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const removeItem = (index: number) => {
    updateQuantity(index, 0);
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      await fetch(`/api/cart?userId=${userId}`, { method: "DELETE" });
      setCart({ items: [], subtotal: 0, taxes: 0, deliveryFee: 0, totalAmount: 0 });
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-coffee-cream pt-24 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-coffee-border border-t-coffee-bronze"
        />
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-coffee-cream pt-24">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-coffee-text-secondary mb-5" />
          <h1 className="text-4xl font-heading font-bold text-coffee-text mb-3">Your Cart is Empty</h1>
          <p className="text-coffee-text-secondary mb-8">Choose a premium brew and make today a rich one.</p>
          <Link href="/menu">
            <button className="luxury-button-primary mx-auto flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Explore Drinks
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-coffee-cream pt-24 pb-20">
      <div className="luxury-container">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-coffee-bronze">Cart</p>
          <h1 className="font-heading text-5xl font-bold text-coffee-text mt-4">Your Selection</h1>
          <p className="max-w-2xl mx-auto text-coffee-text-secondary mt-4">
            Review your order, customize quantities, and proceed to checkout with confidence.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            {cart.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="luxury-card p-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-coffee-text">{item.name}</h2>
                    {Object.keys(item.customizations).length > 0 && (
                      <p className="text-sm text-coffee-text-secondary mt-2">
                        {Object.entries(item.customizations)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(" • ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-base text-coffee-text-secondary">PKR {item.basePrice} each</p>
                    <p className="text-lg font-semibold text-coffee-bronze">PKR {item.subtotal}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center rounded-luxury border border-coffee-border bg-coffee-card px-3 py-2 gap-3">
                    <button
                      onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                      className="text-coffee-text-secondary hover:text-coffee-bronze transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2rem] text-center font-semibold text-coffee-text">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="text-coffee-text-secondary hover:text-coffee-bronze transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-2 rounded-luxury border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <aside className="luxury-card p-6 bg-coffee-light">
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold text-coffee-text">Order Summary</h2>
              <p className="text-sm text-coffee-text-secondary mt-2">
                Confirm totals and move to checkout.
              </p>
            </div>

            <div className="space-y-4 text-sm text-coffee-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {cart.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (17%)</span>
                <span>PKR {cart.taxes}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-coffee-text">{cart.deliveryFee === 0 ? "FREE" : `PKR ${cart.deliveryFee}`}</span>
              </div>
            </div>

            <div className="mt-6 rounded-luxury border border-coffee-border bg-white/80 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-coffee-text-secondary">Total</span>
                <span className="font-heading text-2xl font-bold text-coffee-bronze">PKR {cart.totalAmount}</span>
              </div>
              <p className="text-xs text-coffee-text-secondary">Delivery and taxes included.</p>
            </div>

            <div className="mt-8 space-y-3">
              <Link href="/checkout">
                <button className="luxury-button-primary w-full">Proceed to Checkout</button>
              </Link>
              <button onClick={clearCart} className="luxury-button-secondary w-full">
                Clear Cart
              </button>
            </div>
          </aside>
        </div>

        <div className="mt-10 text-center">
          <Link href="/menu">
            <button className="text-sm font-semibold uppercase tracking-[0.3em] text-coffee-bronze hover:text-coffee-dark transition flex items-center justify-center gap-2 mx-auto">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
