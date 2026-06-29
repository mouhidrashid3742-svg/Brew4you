"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft, MapPin, Phone, User, Check } from "lucide-react";

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
  const [step, setStep] = useState<"phone" | "address" | "review" | "confirmation">("phone");
  const [userId, setUserId] = useState<string>("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
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
    const phone = localStorage.getItem("userPhone");
    const name = localStorage.getItem("userName");
    if (!id) {
      router.push("/auth/login");
      return;
    }
    setUserId(id);
    setUserPhone(phone || "");
    setUserName(name || "");
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
          notes,
          customerPhone: userPhone,
          customerName: userName
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.order.orderId);
        setStep("confirmation");
        toast.success("Order placed successfully!");
        
        await fetch("/api/notifications/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.order.orderId,
            customerName: userName,
            customerPhone: userPhone,
            items: cart.items,
            totalAmount: cart.totalAmount,
            deliveryAddress: address,
            notes
          })
        }).catch(err => console.log("Notification sent (may be in background)"));
        
        await fetch(`/api/cart?userId=${userId}`, { method: "DELETE" });
        
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
      <main className="min-h-screen bg-coffee-cream pt-24 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-4 border-coffee-border border-t-coffee-bronze rounded-full"
        />
      </main>
    );
  }

  if (step === "confirmation" && orderId) {
    return (
      <main className="min-h-screen bg-coffee-cream pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-6"
        >
          {/* Success Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-coffee-light border-2 border-coffee-bronze mb-6"
            >
              <Check className="w-10 h-10 text-coffee-bronze" />
            </motion.div>
            <h1 className="font-heading text-4xl font-bold text-coffee-text mb-3">
              Order Confirmed
            </h1>
            <p className="text-coffee-text-secondary">
              Your premium coffee is being prepared
            </p>
          </div>

          {/* Order Summary Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="luxury-card p-8 mb-8"
          >
            {/* Order Header */}
            <div className="border-b border-coffee-border pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold text-coffee-text">ORDER RECEIPT</h2>
                <span className="text-xs bg-coffee-light text-coffee-bronze px-3 py-1 rounded-full font-semibold">
                  CONFIRMED
                </span>
              </div>
              <p className="text-sm text-coffee-text-secondary">
                Order ID: <span className="font-mono text-coffee-bronze font-bold">{orderId}</span>
              </p>
              <p className="text-sm text-coffee-text-secondary mt-1">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Items */}
            <div className="mb-6 pb-6 border-b border-coffee-border">
              <h3 className="font-heading font-bold text-coffee-text mb-4">Order Items</h3>
              <div className="space-y-3">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-coffee-text">{item.name}</p>
                      {Object.keys(item.customizations).length > 0 && (
                        <p className="text-xs text-coffee-text-secondary mt-1">
                          {Object.entries(item.customizations)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(" • ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-coffee-text-secondary">×{item.quantity}</p>
                      <p className="font-bold text-coffee-bronze">PKR {item.subtotal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="mb-6 pb-6 border-b border-coffee-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-coffee-text-secondary">Subtotal</span>
                <span className="font-medium text-coffee-text">PKR {cart.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coffee-text-secondary">Tax (17% GST)</span>
                <span className="font-medium text-coffee-text">PKR {cart.taxes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coffee-text-secondary">Delivery Fee</span>
                <span className="font-medium text-coffee-text">
                  {cart.deliveryFee === 0 ? (
                    <span className="text-coffee-bronze font-bold">FREE</span>
                  ) : (
                    `PKR ${cart.deliveryFee}`
                  )}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-coffee-light rounded-luxury p-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-coffee-text">TOTAL</span>
                <span className="font-heading text-3xl font-bold text-coffee-bronze">PKR {cart.totalAmount}</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 mb-8"
          >
            <Link href={`/orders/${orderId}`}>
              <button className="luxury-button-primary w-full">
                Track Your Order
              </button>
            </Link>
            <Link href="/menu">
              <button className="luxury-button-secondary w-full">
                Order More
              </button>
            </Link>
          </motion.div>

          {/* WhatsApp Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-coffee-text-secondary mb-3">Share your order</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "923205950705"}?text=${encodeURIComponent(`Hey 9 BAR! I just placed order #${orderId} for PKR ${cart.totalAmount}. Order ID: ${orderId}`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA58] text-white px-6 py-3 rounded-luxury font-medium transition-all hover:shadow-luxury"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2.05 22l6.03-1.58C10.25 21.59 11.12 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-.89 0-1.76-.19-2.6-.55l-.18-.09-1.9.5.51-1.87-.1-.18C4.03 16.3 3 14.24 3 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.89-8.66c-.2-.1-1.19-.59-1.38-.65-.18-.07-.32-.11-.46.11-.13.22-.52.65-.63.78-.12.13-.23.15-.43.04-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.08-.41.08-.08.18-.21.27-.31.09-.11.12-.18.18-.3.07-.13.03-.24-.03-.34-.07-.1-.46-1.11-.63-1.52-.17-.41-.33-.35-.46-.36-.12-.01-.26-.02-.39-.02-.14 0-.36.05-.55.25-.19.2-.72.7-.72 1.71 0 1.01.74 1.98.84 2.12.1.14 1.4 2.14 3.4 2.99.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.18-.48 1.35-.95.16-.47.16-.87.11-.95-.04-.09-.16-.14-.33-.23z" />
              </svg>
              Share Receipt
            </a>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  const steps_list = ["Phone", "Address", "Review", "Confirmation"];
  const current_step_index = ["phone", "address", "review", "confirmation"].indexOf(step);

  return (
    <main className="min-h-screen bg-coffee-cream pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-2">
            {steps_list.map((s, idx) => (
              <div key={s} className="flex-1">
                <div className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`h-10 w-10 rounded-full font-heading font-bold flex items-center justify-center ${
                      idx <= current_step_index
                        ? "bg-coffee-bronze text-coffee-cream"
                        : "bg-coffee-light text-coffee-text-secondary"
                    }`}
                  >
                    {idx < current_step_index ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </motion.div>
                  {idx < steps_list.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full ${
                        idx < current_step_index ? "bg-coffee-bronze" : "bg-coffee-light"
                      }`}
                    />
                  )}
                </div>
                <p className="text-xs font-medium text-coffee-text mt-2 text-center">{s}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phone Step */}
        {step === "phone" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-heading text-2xl font-bold text-coffee-text mb-2">
                Verify Your Contact
              </h2>
              <p className="text-coffee-text-secondary">
                We'll use this to send order updates and contact you about delivery
              </p>
            </div>

            <div className="luxury-card p-8 space-y-6">
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-coffee-text mb-3">
                  <Phone className="inline w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+923001234567"
                  className="w-full rounded-luxury border border-coffee-border bg-coffee-card px-4 py-3 text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze focus:ring-1 focus:ring-coffee-bronze/30 transition-all"
                />
                <p className="text-xs text-coffee-text-secondary mt-2">Format: +923XX or 03XX</p>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-coffee-text mb-3">
                  <User className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-luxury border border-coffee-border bg-coffee-card px-4 py-3 text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze focus:ring-1 focus:ring-coffee-bronze/30 transition-all"
                />
              </div>

              <div className="bg-coffee-light border border-coffee-border rounded-luxury p-4">
                <p className="text-xs text-coffee-text-secondary">
                  <span className="font-bold text-coffee-bronze">📞 Active Number</span>
                  {" "}Make sure this phone number is active. We may call during delivery.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!userPhone || !userName) {
                    toast.error("Please fill in all fields");
                    return;
                  }
                  localStorage.setItem("userPhone", userPhone);
                  localStorage.setItem("userName", userName);
                  setStep("address");
                }}
                className="luxury-button-primary w-full"
              >
                Continue to Address
              </button>
            </div>
          </motion.div>
        )}

        {/* Address Step */}
        {step === "address" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-heading text-2xl font-bold text-coffee-text mb-2">
                Delivery Address
              </h2>
              <p className="text-coffee-text-secondary">
                Where should we send your order?
              </p>
            </div>

            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-coffee-text">Saved Addresses</h3>
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <motion.div
                      key={addr.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`luxury-card p-4 cursor-pointer transition-all ${
                        selectedAddress === addr.id
                          ? "border-coffee-bronze bg-coffee-light"
                          : "border-coffee-border hover:border-coffee-bronze/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                          selectedAddress === addr.id
                            ? "border-coffee-bronze bg-coffee-bronze"
                            : "border-coffee-border"
                        }`}>
                          {selectedAddress === addr.id && (
                            <Check className="w-3 h-3 text-coffee-cream" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-coffee-text">{addr.label}</p>
                          <p className="text-sm text-coffee-text-secondary mt-1">
                            {addr.address}, {addr.city} {addr.zipCode}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Address */}
            <div className="luxury-card p-6 space-y-4">
              <h3 className="font-medium text-coffee-text">Add New Address</h3>
              
              <input
                type="text"
                placeholder="Label (e.g., Home, Office)"
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                className="w-full rounded-luxury border border-coffee-border bg-coffee-card px-4 py-3 text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze"
              />

              <input
                type="text"
                placeholder="Street Address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                className="w-full rounded-luxury border border-coffee-border bg-coffee-card px-4 py-3 text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className="w-full rounded-luxury border border-coffee-border bg-coffee-card px-4 py-3 text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                  className="w-full rounded-luxury border border-coffee-border bg-coffee-card px-4 py-3 text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze"
                />
              </div>

              <button
                onClick={addAddress}
                disabled={loading}
                className="luxury-button-secondary w-full"
              >
                {loading ? "Adding..." : "Add Address"}
              </button>
            </div>

            <button
              onClick={() => setStep("review")}
              disabled={!selectedAddress}
              className="luxury-button-primary w-full disabled:opacity-50"
            >
              Continue to Review
            </button>
          </motion.div>
        )}

        {/* Review Step */}
        {step === "review" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-heading text-2xl font-bold text-coffee-text mb-2">
                Order Review
              </h2>
              <p className="text-coffee-text-secondary">
                Confirm your order details before placing
              </p>
            </div>

            {/* Order Items */}
            <div className="luxury-card p-6 space-y-4">
              <h3 className="font-medium text-coffee-text">Your Items</h3>
              {cart.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-coffee-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-coffee-text">{item.name}</p>
                    <p className="text-xs text-coffee-text-secondary">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-coffee-bronze">PKR {item.subtotal}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="luxury-card p-6 space-y-3 bg-coffee-light">
              <div className="flex justify-between text-sm">
                <span className="text-coffee-text-secondary">Subtotal</span>
                <span className="text-coffee-text">PKR {cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-coffee-text-secondary">Tax (17%)</span>
                <span className="text-coffee-text">PKR {cart.taxes}</span>
              </div>
              <div className="flex justify-between text-sm pb-3 border-b border-coffee-border">
                <span className="text-coffee-text-secondary">Delivery</span>
                <span className="text-coffee-text font-bold">
                  {cart.deliveryFee === 0 ? "FREE" : `PKR ${cart.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="font-heading font-bold text-coffee-text">Total</span>
                <span className="font-heading text-2xl font-bold text-coffee-bronze">PKR {cart.totalAmount}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="luxury-card p-6">
              <label className="block text-sm font-medium text-coffee-text mb-3">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests?"
                rows={3}
                className="w-full rounded-luxury border border-coffee-border bg-coffee-card px-4 py-3 text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("address")}
                className="luxury-button-secondary flex-1"
              >
                Back
              </button>
              <button
                onClick={() => setStep("confirmation")}
                className="luxury-button-primary flex-1"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
