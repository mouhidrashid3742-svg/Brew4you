"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import CoffeeIntensityMeter from "@/components/coffee-intensity-meter";
import toast from "react-hot-toast";

const strengthOptions = ["Mild", "Medium", "Strong"] as const;
const milkOptions = ["Full Cream", "Less Milk"] as const;
const sugarOptions = ["No Sugar", "Less Sugar", "Normal"] as const;
const iceOptions = ["No Ice", "Light Ice", "Normal Ice"] as const;
const extras = ["Extra Espresso Shot", "Whipped Cream", "Caramel Drizzle"] as const;

const basePrice = 320;
const strengthModifier = { Mild: 0, Medium: 30, Strong: 60 };
const extraPrices = { "Extra Espresso Shot": 70, "Whipped Cream": 45, "Caramel Drizzle": 55 };

export default function BuildYourOwnForm() {
  const [strength, setStrength] = useState<typeof strengthOptions[number]>("Medium");
  const [milk, setMilk] = useState<typeof milkOptions[number]>("Full Cream");
  const [sugar, setSugar] = useState<typeof sugarOptions[number]>("Normal");
  const [ice, setIce] = useState<typeof iceOptions[number]>("Normal Ice");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const price = useMemo(() => {
    const extrasTotal = selectedExtras.reduce((sum, item) => sum + extraPrices[item as keyof typeof extraPrices], 0);
    return basePrice + strengthModifier[strength] + extrasTotal;
  }, [strength, selectedExtras]);

  const intensity = strength === "Mild" ? 2 : strength === "Medium" ? 3 : 5;

  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8 rounded-[32px] border border-white/10 bg-[#111111]/70 p-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Build Your Own Coffee</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Customize a luxury brew to your exact taste.</h1>
          <p className="leading-7 text-ink/80">
            Choose strength, milk, sugar, ice, and premium extras. Your drink updates instantly with every selection.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3 rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <p className="font-semibold">Coffee Strength</p>
            <div className="grid gap-2">
              {strengthOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStrength(option)}
                  className={`rounded-3xl border px-4 py-3 text-left transition ${strength === option ? "border-gold bg-white/5 text-gold" : "border-white/10 text-ink/80 hover:border-gold/70"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <p className="font-semibold">Milk</p>
            <div className="grid gap-2">
              {milkOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMilk(option)}
                  className={`rounded-3xl border px-4 py-3 text-left transition ${milk === option ? "border-gold bg-white/5 text-gold" : "border-white/10 text-ink/80 hover:border-gold/70"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <p className="font-semibold">Sugar</p>
            <div className="grid gap-2">
              {sugarOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSugar(option)}
                  className={`rounded-3xl border px-4 py-3 text-left transition ${sugar === option ? "border-gold bg-white/5 text-gold" : "border-white/10 text-ink/80 hover:border-gold/70"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-[28px] border border-white/10 bg-[#111111] p-5">
            <p className="font-semibold">Ice</p>
            <div className="grid gap-2">
              {iceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIce(option)}
                  className={`rounded-3xl border px-4 py-3 text-left transition ${ice === option ? "border-gold bg-white/5 text-gold" : "border-white/10 text-ink/80 hover:border-gold/70"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[32px] border border-white/10 bg-[#111111]/80 p-6">
          <p className="font-semibold">Extras</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {extras.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setSelectedExtras((current) =>
                    current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
                  )
                }
                className={`rounded-3xl border px-4 py-3 text-left transition ${selectedExtras.includes(option) ? "border-gold bg-white/5 text-gold" : "border-white/10 text-ink/80 hover:border-gold/70"}`}
              >
                {option} + PKR {extraPrices[option as keyof typeof extraPrices]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[32px] border border-gold/30 bg-[#111111]/80 p-6">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-ink/70">
            <span>Estimated price</span>
            <span>{formatCurrency(price)}</span>
          </div>
          <Button
            type="button"
            onClick={() => toast.success("Your custom coffee has been saved for ordering.")}
          >
            Reserve My Custom Brew
          </Button>
        </div>
      </div>

      <aside className="space-y-8 rounded-[32px] border border-white/10 bg-[#111111]/70 p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Quick preview</p>
          <h2 className="text-3xl font-semibold">Your handcrafted coffee</h2>
        </div>
        <div className="space-y-5 rounded-[28px] border border-white/10 bg-[#0f0f0f]/80 p-6">
          <p className="text-sm text-ink/70">Strength</p>
          <p className="text-xl font-semibold text-gold">{strength}</p>
          <p className="text-sm text-ink/70">Milk</p>
          <p className="text-lg">{milk}</p>
          <p className="text-sm text-ink/70">Sugar</p>
          <p className="text-lg">{sugar}</p>
          <p className="text-sm text-ink/70">Ice</p>
          <p className="text-lg">{ice}</p>
          <p className="text-sm text-ink/70">Extras</p>
          <ul className="list-disc pl-5 text-ink/80">
            {selectedExtras.map((extra) => (
              <li key={extra}>{extra}</li>
            ))}
            {selectedExtras.length === 0 ? <li>No extras selected</li> : null}
          </ul>
        </div>
        <CoffeeIntensityMeter level={intensity} />
      </aside>
    </section>
  );
}
