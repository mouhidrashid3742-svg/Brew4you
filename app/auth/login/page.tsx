"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Phone, CheckCircle, Loader } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();
      if (data.otpForDemo) {
        setDemoOtp(data.otpForDemo);
        toast.success("OTP sent! (Demo: " + data.otpForDemo + ")");
        setStep("otp");
      } else {
        toast.success("OTP sent to your phone");
        setStep("otp");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userPhone", data.user.phone);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("authToken", data.token);
        toast.success("Logged in successfully!");
        router.push("/menu");
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-24">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to 9 BAR</h1>
            <p className="text-ink/70">
              {step === "phone"
                ? "Enter your phone to get started"
                : "Enter the OTP we sent to your phone"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={step === "phone" ? handleSendOtp : handleVerifyOtp} className="space-y-4">
            {step === "phone" ? (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="+923001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-ink placeholder-ink/40 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink/50">Pakistan format: +923XX or 03XX</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gold hover:bg-gold/90 text-surface font-semibold rounded-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Send OTP
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    maxLength={6}
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-center text-2xl tracking-widest text-ink placeholder-ink/40 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 font-mono"
                  />
                  {demoOtp && (
                    <p className="mt-2 text-xs text-gold bg-gold/10 p-2 rounded">
                      Demo OTP: {demoOtp}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-gold hover:bg-gold/90 text-surface font-semibold rounded-lg"
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify OTP
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Demo Info */}
          <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
            <p className="text-xs text-ink/70">
              <strong>Demo Mode:</strong> Use any Pakistan phone number (+923XX format) and any 6-digit code as OTP.
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <Link href="/" className="text-sm text-gold hover:text-gold/80 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
