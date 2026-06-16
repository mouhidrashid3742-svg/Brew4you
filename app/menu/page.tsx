"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";

const categories = ["All", "Hot Coffee", "Cold Coffee", "Frappes", "Non Coffee"];

interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  popular?: boolean;
  intensity?: number;
}

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setMenuItems(data.products || []);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const storedFavorites = window.localStorage.getItem("brew4you_favorites");
    const storedRecent = window.localStorage.getItem("brew4you_recent");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("brew4you_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem("brew4you_recent", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory = category === "All" || item.category === category;
      const matchSearch = [item.name, item.description, item.category].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      );
      return matchCategory && matchSearch;
    });
  }, [category, search, menuItems]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const recordView = (id: string) => {
    setRecentlyViewed((current) => {
      const next = [id, ...current.filter((item) => item !== id)];
      return next.slice(0, 5);
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
      <section className="space-y-5 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Our menu</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Artisan drinks for every coffee mood.</h1>
        <p className="mx-auto max-w-2xl leading-8 text-ink/70">
          Explore hot coffee, iced classics, frappes, and premium non-coffee creations. Filter by category or search the menu instantly.
        </p>
      </section>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_240px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-5 py-3 text-sm transition ${category === item ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-ink/70 hover:border-gold"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Input
              type="search"
              placeholder="Search drinks"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-sm"
            />
          </div>

          <div id="menu-list" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <p className="col-span-full text-center text-ink/70">Loading menu...</p>
            ) : filtered.length === 0 ? (
              <p className="col-span-full text-center text-ink/70">No drinks match your request.</p>
            ) : (
              filtered.map((item) => (
                <ProductCard
                  key={item._id || item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image}
                  popular={item.popular || false}
                  intensity={item.intensity || 3}
                  favorite={favorites.includes(item._id || item.id || "")}
                  onFavorite={() => toggleFavorite(item._id || item.id || "")}
                  onView={() => recordView(item._id || item.id || "")}
                />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-6 rounded-[32px] border border-white/10 bg-[#111111]/70 p-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Recommended For You</p>
            <h2 className="text-2xl font-semibold">Featured favorites</h2>
          </div>
          {menuItems.filter((item) => item.popular).slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-[28px] border border-white/10 bg-[#0f0f0f]/80 p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-ink/60">{item.category}</p>
                </div>
                <span className="text-gold">PKR {item.price}</span>
              </div>
            </div>
          ))}

          <div className="rounded-[32px] border border-white/10 bg-[#0f0f0f]/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Favorites</p>
            {favorites.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm text-ink/80">
                {favorites.map((id) => {
                  const item = menuItems.find((menu) => menu.id === id);
                  return item ? (
                    <li key={id} className="rounded-3xl border border-white/10 bg-[#111111]/80 px-4 py-3">
                      {item.name}
                    </li>
                  ) : null;
                })}
              </ul>
            ) : (
              <p className="mt-4 text-ink/70">Tap the star icons to save drinks here.</p>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#0f0f0f]/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Recently Viewed</p>
            {recentlyViewed.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm text-ink/80">
                {recentlyViewed.map((id) => {
                  const item = menuItems.find((menu) => menu.id === id);
                  return item ? (
                    <li key={id} className="rounded-3xl border border-white/10 bg-[#111111]/80 px-4 py-3">
                      {item.name}
                    </li>
                  ) : null;
                })}
              </ul>
            ) : (
              <p className="mt-4 text-ink/70">Your latest drink views will appear here.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
