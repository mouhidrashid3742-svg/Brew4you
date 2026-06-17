"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Gift, Crown, Zap, TrendingUp, ArrowLeft } from "lucide-react";

interface LoyaltyInfo {
  points: number;
  tier: string;
  nextRewardAt: string | number;
  totalSpent: number;
  orderCount: number;
  transactions: Array<{
    _id: string;
    pointsEarned: number;
    pointsUsed: number;
    balanceAfter: number;
    transactionType: string;
    description: string;
    createdAt: string;
  }>;
}

export default function LoyaltyPage() {
  const router = useRouter();
  const [loyalty, setLoyalty] = useState<LoyaltyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/auth/login");
      return;
    }
    setUserId(id);
    fetchLoyalty(id);
  }, [router]);

  const fetchLoyalty = async (id: string) => {
    try {
      const res = await fetch(`/api/loyalty?userId=${id}`);
      const data = await res.json();
      if (data.success) {
        setLoyalty(data.loyalty);
      }
    } catch (error) {
      toast.error("Failed to load loyalty info");
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

  if (!loyalty) {
    return (
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-6 py-8 text-center">
          <p className="text-ink/70 mb-6">Failed to load loyalty information</p>
          <Link href="/account">
            <Button>Back to Account</Button>
          </Link>
        </div>
      </main>
    );
  }

  const tierLevels = [
    { name: "Bronze", minPoints: 0, maxPoints: 2499, icon: "🥉", color: "text-amber-700" },
    { name: "Silver", minPoints: 2500, maxPoints: 4999, icon: "🥈", color: "text-gray-400" },
    { name: "Gold", minPoints: 5000, maxPoints: Infinity, icon: "🥇", color: "text-gold" }
  ];

  const currentTier = tierLevels.find(
    (t) => loyalty.points >= t.minPoints && loyalty.points <= t.maxPoints
  );

  const pointsToNextTier = currentTier?.maxPoints === Infinity 
    ? "Max Tier"
    : Math.max(0, (currentTier?.maxPoints || 0) + 1 - loyalty.points);

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="inline-block">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Loyalty Rewards</h1>
        </div>

        {/* Current Tier */}
        <div className="glass-card rounded-2xl p-6 mb-8 bg-gradient-to-br from-gold/10 via-transparent to-transparent border border-gold/20">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-4xl mb-2">{currentTier?.icon}</p>
              <p className="font-bold">{currentTier?.name}</p>
              <p className="text-xs text-ink/60">Current Tier</p>
            </div>
            <div className="text-center border-l border-r border-white/10">
              <p className="text-3xl font-bold text-gold">{loyalty.points}</p>
              <p className="text-xs text-ink/60">Points</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gold">{pointsToNextTier}</p>
              <p className="text-xs text-ink/60">
                {pointsToNextTier === "Max Tier" ? "Max Tier" : "to next tier"}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {typeof pointsToNextTier === "number" && (
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gold h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (loyalty.points / ((currentTier?.maxPoints as number) + 1)) * 100)}%`
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Tier Benefits */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tierLevels.map((tier) => (
            <div
              key={tier.name}
              className={`glass-card rounded-2xl p-4 text-center transition border ${
                currentTier?.name === tier.name
                  ? "border-gold/50 bg-gold/10"
                  : "border-white/10"
              }`}
            >
              <p className="text-2xl mb-2">{tier.icon}</p>
              <p className="font-bold">{tier.name}</p>
              <p className="text-xs text-ink/60 mt-1">
                {tier.minPoints.toLocaleString()}-
                {tier.maxPoints === Infinity ? "∞" : tier.maxPoints.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-gold" />
            Tier Benefits
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">1 point per PKR spent</p>
                <p className="text-sm text-ink/70">Earn points on every order</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Exclusive perks</p>
                <p className="text-sm text-ink/70">
                  {loyalty.tier === "Gold"
                    ? "VIP discounts and early access to new items"
                    : loyalty.tier === "Silver"
                    ? "Special offers and bonus points"
                    : "Free delivery and welcome offers"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Faster rewards</p>
                <p className="text-sm text-ink/70">
                  {loyalty.tier === "Gold"
                    ? "Advance faster to exclusive benefits"
                    : "Keep ordering to unlock higher tiers"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-gold">{loyalty.orderCount}</p>
            <p className="text-sm text-ink/70">Total Orders</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-gold">PKR {loyalty.totalSpent}</p>
            <p className="text-sm text-ink/70">Total Spent</p>
          </div>
        </div>

        {/* Transaction History */}
        {loyalty.transactions && loyalty.transactions.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loyalty.transactions.map((tx) => (
                <div key={tx._id} className="border-l-2 border-gold/30 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold capitalize text-ink/80">{tx.transactionType}</p>
                    <p
                      className={`font-bold ${
                        (tx.pointsEarned || 0) > 0 ? "text-gold" : "text-red-500"
                      }`}
                    >
                      {(tx.pointsEarned || 0) > 0 ? "+" : "-"}
                      {Math.abs(tx.pointsEarned || tx.pointsUsed || 0)} points
                    </p>
                  </div>
                  <p className="text-sm text-ink/70">{tx.description}</p>
                  <p className="text-xs text-ink/50 mt-1">
                    {new Date(tx.createdAt).toLocaleDateString()} at{" "}
                    {new Date(tx.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href="/menu" className="block mt-8">
          <Button className="w-full bg-gold hover:bg-gold/90 text-surface">
            Order More, Earn More
          </Button>
        </Link>
      </div>
    </main>
  );
}
