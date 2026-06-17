"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { LogOut, User, MapPin, Heart, Clock, Trash2, Plus, Edit } from "lucide-react";

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

interface Order {
  orderId: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  totalSpent: number;
  orderCount: number;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"profile" | "addresses" | "orders">("profile");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

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
      const [profileRes, addrRes, ordersRes] = await Promise.all([
        fetch(`/api/users/profile?userId=${id}`),
        fetch(`/api/users/addresses?userId=${id}`),
        fetch(`/api/orders?userId=${id}`)
      ]);

      const profileData = await profileRes.json();
      setUser(profileData.user);
      setNewName(profileData.user.name);

      if (addrRes.ok) {
        const addrData = await addrRes.json();
        setAddresses(addrData.addresses || []);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateName = async () => {
    if (!newName || !userId) return;

    try {
      await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          updates: { name: newName }
        })
      });

      setUser(user ? { ...user, name: newName } : null);
      setEditingName(false);
      toast.success("Name updated");
      localStorage.setItem("userName", newName);
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!userId) return;

    try {
      await fetch("/api/users/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, addressId })
      });

      setAddresses(addresses.filter((a) => a.id !== addressId));
      toast.success("Address deleted");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken");
    toast.success("Logged out");
    router.push("/");
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Button
            variant="outline"
            onClick={logout}
            className="text-red-500 border-red-500/50 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "addresses", label: "Addresses", icon: MapPin },
            { id: "orders", label: "Orders", icon: Clock }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-3 transition font-medium ${
                tab === t.id
                  ? "text-gold border-b-2 border-gold"
                  : "text-ink/70 hover:text-gold"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && user && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-ink/70 mb-2">Name</label>
                  {editingName ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-[#111111] px-3 py-2 outline-none focus:border-gold/50"
                      />
                      <Button
                        onClick={updateName}
                        className="bg-gold hover:bg-gold/90 text-surface"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingName(false);
                          setNewName(user.name);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <button
                        onClick={() => setEditingName(true)}
                        className="p-2 hover:bg-gold/20 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4 text-gold" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-ink/70 mb-2">Phone</label>
                  <p className="font-semibold">{user.phone}</p>
                </div>

                {user.email && (
                  <div>
                    <label className="block text-sm text-ink/70 mb-2">Email</label>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Statistics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gold">{user.orderCount}</p>
                  <p className="text-sm text-ink/70">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gold">PKR {user.totalSpent}</p>
                  <p className="text-sm text-ink/70">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gold">{user.loyaltyPoints}</p>
                  <p className="text-sm text-ink/70">Loyalty Points</p>
                </div>
              </div>
            </div>

            <Link href="/loyalty">
              <Button className="w-full bg-gold hover:bg-gold/90 text-surface">
                <Heart className="mr-2 h-4 w-4" />
                View Loyalty Dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Addresses Tab */}
        {tab === "addresses" && (
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-ink/40 mb-4" />
                <p className="text-ink/70 mb-6">No addresses saved yet</p>
                <Link href="/checkout">
                  <Button className="bg-gold hover:bg-gold/90 text-surface">
                    Add Address
                  </Button>
                </Link>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="glass-card rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold">{addr.label}</p>
                      <p className="text-sm text-ink/70">{addr.address}</p>
                      <p className="text-sm text-ink/70">
                        {addr.city} {addr.zipCode}
                      </p>
                      {addr.isDefault && (
                        <p className="text-xs text-gold mt-2">Default Address</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-ink/40 mb-4" />
                <p className="text-ink/70 mb-6">No orders yet</p>
                <Link href="/menu">
                  <Button className="bg-gold hover:bg-gold/90 text-surface">
                    Start Ordering
                  </Button>
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <Link key={order.orderId} href={`/orders/${order.orderId}`}>
                  <div className="glass-card rounded-2xl p-4 hover:bg-white/5 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-sm text-gold">{order.orderId}</p>
                        <p className="text-ink/70 text-sm mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-2 capitalize">
                          Status: <span className="text-gold font-semibold">{order.orderStatus}</span>
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gold">PKR {order.totalAmount}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
