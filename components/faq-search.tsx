"use client";

import { useMemo, useState } from "react";
import { faqItems } from "@/data/faq";
import { Input } from "@/components/ui/input";

export default function FaqSearch() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => faqItems.filter((item) => item.question.toLowerCase().includes(query.toLowerCase()) || item.answer.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <section className="space-y-6">
      <div className="max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Smart FAQ Search</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Find answers before you ask.</h2>
      </div>
      <div className="space-y-5">
        <Input
          type="search"
          placeholder="Search questions, keywords, delivery, ingredients..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-3xl"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <div key={item.question} className="glass-card rounded-[28px] p-6">
              <h3 className="text-lg font-semibold">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-ink/75">{item.answer}</p>
            </div>
          ))}
          {filtered.length === 0 ? <div className="text-ink/60">No FAQ results found.</div> : null}
        </div>
      </div>
    </section>
  );
}
