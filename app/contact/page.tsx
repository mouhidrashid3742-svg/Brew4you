"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { buildWhatsAppLink } from "@/lib/communications";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const email = process.env.NEXT_PUBLIC_EMAIL ?? "9bar.pk@gmail.com";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE ?? "+923205950705";
  const foodpandaUrl = process.env.NEXT_PUBLIC_FOODPANDA ?? "https://www.foodpanda.pk/";
  const whatsappLink = buildWhatsAppLink(process.env.NEXT_PUBLIC_WHATSAPP ?? "923205950705");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const body = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(body.error || "Unable to submit form.");
      return;
    }

    toast.success(body.message);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
      <section className="grid gap-12 lg:grid-cols-[0.95fr_0.75fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Contact</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Reach 9 BAR for orders, feedback, or collaborations.</h1>
          <p className="max-w-3xl leading-8 text-ink/75">
            Visit our boutique coffee studio in Eden Valley, Faisalabad. Send us a message and our team will respond promptly.
          </p>

          <div className="space-y-4 rounded-[32px] border border-white/10 bg-[#111111]/70 p-8">
            <p className="text-lg font-semibold">Business Hours</p>
            <p className="text-sm text-ink/70">Monday - Sunday: 8:00 AM - 11:00 PM</p>
            <p className="text-lg font-semibold">Address</p>
            <p className="text-sm text-ink/70">Eden Valley, Faisalabad</p>
            <p className="text-lg font-semibold">Email</p>
            <p className="text-sm text-ink/70">{email}</p>
            <p className="text-lg font-semibold">Phone</p>
            <a href={`tel:${phoneNumber}`} className="text-sm text-ink/70 hover:text-gold transition">
              {phoneNumber}
            </a>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">WhatsApp</a>
              <a href={foodpandaUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-ink">Foodpanda</a>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#111111]/70 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            <Input name="email" type="email" placeholder="Your email" value={form.email} onChange={handleChange} required />
            <Input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
            <Textarea name="message" placeholder="How can we help?" value={form.message} onChange={handleChange} required />
            <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
          </form>
          <div className="mt-10 h-[300px] overflow-hidden rounded-[28px] border border-white/10">
            <iframe
              className="h-full w-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13619.57732766101!2d73.05066438817173!3d31.428444887186446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391901a186043323%3A0xef6938f17f0e4838!2sEden%20Valley%2C%20Faisalabad!5e0!3m2!1sen!2s!4v1710000000000"
              title="9 BAR location"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
