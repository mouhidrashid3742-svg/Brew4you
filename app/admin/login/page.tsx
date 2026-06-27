"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      toast.success(result.message);
      router.push("/admin");
    } else {
      toast.error(result.error || "Login failed.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center px-6 py-24 sm:px-8">
      <div className="w-full rounded-[32px] border border-white/10 bg-[#111111]/80 p-10 shadow-glow">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Admin Access</p>
        <h1 className="mt-4 text-3xl font-semibold">Secure Dashboard Login</h1>
        <p className="mt-3 text-ink/70">Enter your admin secret to manage 9 BAR products, pricing, and availability.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin secret"
            required
          />
          <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
        </form>
      </div>
    </main>
  );
}
