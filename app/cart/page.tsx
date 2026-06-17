"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
      <main className="min-h-screen bg-surface pt-24">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-surface pt-24">
        <div className="mx-auto max-w-2xl px-6 py-12 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-ink/40 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-ink/70 mb-6">Add some delicious coffee to get started</p>
          <Link href="/menu">
            <Button className="bg-gold hover:bg-gold/90 text-surface">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.items.map((item, index) => (
            <div key={index} className="glass-card rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                {Object.keys(item.customizations).length > 0 && (
                  <p className="text-xs text-ink/60 mt-1">
                    {Object.entries(item.customizations)
                      .map(([key, val]) => `${key}: ${val}`)
                      .join(" • ")}
                  </p>
                )}
                <p className="text-gold font-semibold mt-2">PKR {item.subtotal}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="p-1 hover:bg-gold/20 rounded-lg transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="p-1 hover:bg-gold/20 rounded-lg transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => removeItem(index)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass-card rounded-2xl p-6 space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-ink/70">Subtotal</span>
            <span className="font-semibold">PKR {cart.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/70">Tax (17%)</span>
            <span className="font-semibold">PKR {cart.taxes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/70">Delivery Fee</span>
            <span className="font-semibold">
              {cart.deliveryFee === 0 ? (
                <span className="text-gold">FREE</span>
              ) : (
                `PKR ${cart.deliveryFee}`
              )}
            </span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between">
            <span className="font-bold text-lg">Total</span>
            <span className="text-xl font-bold text-gold">PKR {cart.totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={clearCart}
            className="flex-1"
          >
            Clear Cart
          </Button>
          <Link href="/checkout" className="flex-1">
            <Button className="w-full bg-gold hover:bg-gold/90 text-surface">
              Proceed to Checkout
            </Button>
          </Link>
        </div>

        <Link href="/menu">
          <Button variant="ghost" className="w-full mt-4">
            ← Continue Shopping
          </Button>
        </Link>
      </div>
    </main>
  );
}
