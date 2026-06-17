"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { ArrowLeft, MapPin, CreditCard, Calendar, Loader } from "lucide-react";

interface CartItem {
  itemId: string;
  name: string;
  basePrice: number;
  customizations: Record<string, any>;
  quantity: number;
  subtotal: number;
}

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  totalAmount: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"address" | "review" | "confirmation">("address");
  const [userId, setUserId] = useState<string>("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
    city: "",
    zipCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [scheduledFor, setScheduledFor] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/auth/login");
      return;
    }
    setUserId(id);
    loadData(id);
  }, [router]);

  const loadData = async (id: string) => {
    try {
      const [cartRes, addrRes] = await Promise.all([
        fetch(`/api/cart?userId=${id}`),
        fetch(`/api/users/addresses?userId=${id}`)
      ]);

      const cartData = await cartRes.json();
      setCart(cartData.cart);

      if (addrRes.ok) {
        const addrData = await addrRes.json();
        setAddresses(addrData.addresses || []);
        const defaultAddr = addrData.addresses?.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      toast.error("Failed to load checkout data");
    }
  };

  const addAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.zipCode) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          address: {
            ...newAddress,
            label: newAddress.label || "My Address",
            isDefault: addresses.length === 0
          }
        })
      });

      const data = await res.json();
      setAddresses([...addresses, data.address]);
      setSelectedAddress(data.address.id);
      setNewAddress({ label: "", address: "", city: "", zipCode: "" });
      toast.success("Address added");
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress || !cart) {
      toast.error("Please select an address");
      return;
    }

    const address = addresses.find((a) => a.id === selectedAddress);
    if (!address) {
      toast.error("Invalid address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: cart.items,
          deliveryAddress: {
            address: address.address,
            city: address.city,
            zipCode: address.zipCode
          },
          paymentMethod,
          scheduledFor,
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.order.orderId);
        setStep("confirmation");
        toast.success("Order placed successfully!");
        
        // Clear cart
        await fetch(`/api/cart?userId=${userId}`, { method: "DELETE" });
        
        // Add loyalty points
        await fetch("/api/loyalty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET || ""
          },
          body: JSON.stringify({
            userId,
            orderId: data.order.orderId,
            pointsEarned: data.order.totalAmount,
            transactionType: "earn",
            description: `Order ${data.order.orderId} placed`
          })
        });
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <main className="min-h-screen bg-surface pt-24">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      </main>
    );
  }

  if (step === "confirmation" && orderId) {
    return (
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-ink/70">Your coffee will arrive in ~35 minutes</p>
          </div>

          {/* Bill/Invoice */}
          <div className="glass-card rounded-2xl p-6 mb-8 border border-gold/20">
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">ORDER RECEIPT</h2>
                <span className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full font-semibold">CONFIRMED</span>
              </div>
              <p className="text-sm text-ink/60">Order ID: <span className="font-mono text-gold font-bold">{orderId}</span></p>
              <p className="text-sm text-ink/60 mt-1">Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            </div>

            {/* Items */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="font-bold mb-4">Order Items</h3>
              <div className="space-y-3">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      {Object.keys(item.customizations).length > 0 && (
                        <p className="text-xs text-ink/60 mt-1">
                          {Object.entries(item.customizations)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(" • ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-ink/60">x{item.quantity}</p>
                      <p className="font-bold text-gold">PKR {item.subtotal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mb-6 pb-6 border-b border-white/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink/70">Subtotal</span>
                <span className="font-semibold">PKR {cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink/70">Tax (17% GST)</span>
                <span className="font-semibold">PKR {cart.taxes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink/70">Delivery Fee</span>
                <span className="font-semibold">
                  {cart.deliveryFee === 0 ? (
                    <span className="text-gold">FREE</span>
                  ) : (
                    `PKR ${cart.deliveryFee}`
                  )}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gold/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">TOTAL AMOUNT</span>
                <span className="text-2xl font-bold text-gold">PKR {cart.totalAmount}</span>
              </div>
              <p className="text-xs text-ink/60 mt-2">Payment Method: Cash on Delivery</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href={`/orders/${orderId}`} className="block">
              <Button className="w-full bg-gold hover:bg-gold/90 text-surface font-semibold h-12">
                Track Order in Real-Time
              </Button>
            </Link>
            <Link href="/menu" className="block">
              <Button variant="outline" className="w-full">
                Order More
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Share to WhatsApp */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg text-center">
            <p className="text-sm text-ink/70 mb-3">Share your order with WhatsApp</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "923000000000"}?text=${encodeURIComponent(`Hey Brew4You! I just placed order #${orderId} for PKR ${cart.totalAmount}. Order ID: ${orderId}`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA58] text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2.05 22l6.03-1.58C10.25 21.59 11.12 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-.89 0-1.76-.19-2.6-.55l-.18-.09-1.9.5.51-1.87-.1-.18C4.03 16.3 3 14.24 3 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.89-8.66c-.2-.1-1.19-.59-1.38-.65-.18-.07-.32-.11-.46.11-.13.22-.52.65-.63.78-.12.13-.23.15-.43.04-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.08-.41.08-.08.18-.21.27-.31.09-.11.12-.18.18-.3.07-.13.03-.24-.03-.34-.07-.1-.46-1.11-.63-1.52-.17-.41-.33-.35-.46-.36-.12-.01-.26-.02-.39-.02-.14 0-.36.05-.55.25-.19.2-.72.7-.72 1.71 0 1.01.74 1.98.84 2.12.1.14 1.4 2.14 3.4 2.99.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.18-.48 1.35-.95.16-.47.16-.87.11-.95-.04-.09-.16-.14-.33-.23z" />
              </svg>
              Share Receipt
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Address Step */}
        {step === "address" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

              {addresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  {addresses.map((addr) => (
                    <label key={addr.id} className="block">
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mr-3"
                      />
                      <span className="glass-card rounded-lg p-3 cursor-pointer inline-block w-full">
                        <p className="font-semibold">{addr.label}</p>
                        <p className="text-sm text-ink/70">
                          {addr.address}, {addr.city} {addr.zipCode}
                        </p>
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="glass-card rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold">Add New Address</h3>
                <input
                  type="text"
                  placeholder="Address Label (e.g., Home)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm outline-none focus:border-gold/50"
                />
                <input
                  type="text"
                  placeholder="Full Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm outline-none focus:border-gold/50"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm outline-none focus:border-gold/50"
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm outline-none focus:border-gold/50"
                  />
                </div>
                <Button
                  onClick={addAddress}
                  disabled={loading}
                  className="w-full bg-gold/20 hover:bg-gold/30 text-gold"
                >
                  {loading ? "Adding..." : "Add Address"}
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Additional Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Special Instructions (Optional)</label>
                  <textarea
                    placeholder="e.g., Extra hot, no foam, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/cart" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Button
                onClick={() => setStep("review")}
                className="flex-1 bg-gold hover:bg-gold/90 text-surface"
              >
                Review Order
              </Button>
            </div>
          </div>
        )}

        {/* Review Step */}
        {step === "review" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Order Review</h2>
              <div className="glass-card rounded-2xl p-4 space-y-2">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">PKR {item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="block">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="glass-card rounded-lg p-3 cursor-pointer inline-block w-full">
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-2">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span>
                <span>PKR {cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Tax</span>
                <span>PKR {cart.taxes}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Delivery</span>
                <span>{cart.deliveryFee === 0 ? "FREE" : `PKR ${cart.deliveryFee}`}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-gold">PKR {cart.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("address")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={placeOrder}
                disabled={loading}
                className="flex-1 bg-gold hover:bg-gold/90 text-surface"
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
