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
        <div className="mx-auto max-w-2xl px-6 py-8 text-center">
          <div className="mb-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 mb-4">
              <span className="text-3xl">✓</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
          <p className="text-ink/70 mb-6">Your coffee will arrive in ~35 minutes</p>
          
          <div className="glass-card rounded-2xl p-6 mb-6 text-left">
            <p className="text-sm text-ink/60 mb-2">Order ID</p>
            <p className="font-mono text-lg font-bold text-gold mb-4">{orderId}</p>
            <p className="text-sm text-ink/60 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gold">PKR {cart.totalAmount}</p>
          </div>

          <div className="space-y-3">
            <Link href={`/orders/${orderId}`} className="block">
              <Button className="w-full bg-gold hover:bg-gold/90 text-surface">
                Track Order
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
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
