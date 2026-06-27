"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart } from "lucide-react";

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
    const storedFavorites = window.localStorage.getItem("9bar_favorites");
    const storedRecent = window.localStorage.getItem("9bar_recent");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("9bar_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem("9bar_recent", JSON.stringify(recentlyViewed));
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
    <main className="min-h-screen bg-coffee-cream pt-24 pb-20">
      {/* Hero Section */}
      <section className="luxury-section bg-coffee-light">
        <div className="luxury-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-medium text-coffee-bronze tracking-widest uppercase">
              Discover Our Selection
            </span>
            <h1 className="font-heading text-5xl font-bold text-coffee-text mt-4">
              Our Menu
            </h1>
            <p className="text-coffee-text-secondary max-w-2xl mx-auto mt-4">
              Carefully curated specialties crafted with precision and passion
            </p>
          </motion.div>
        </div>
      </section>

      <section className="luxury-section">
        <div className="luxury-container">
          {/* Filters */}
          <div className="mb-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Categories */}
              <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                  <motion.button
                    key={item}
                    whileHover={{ y: -2 }}
                    onClick={() => setCategory(item)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                      category === item
                        ? "bg-coffee-bronze text-coffee-cream shadow-luxury"
                        : "border border-coffee-border text-coffee-text hover:border-coffee-bronze hover:bg-coffee-light"
                    }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee-text-secondary" />
                <input
                  type="search"
                  placeholder="Search drinks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-luxury border border-coffee-border bg-coffee-card text-coffee-text placeholder:text-coffee-text-secondary focus:outline-none focus:border-coffee-bronze focus:ring-1 focus:ring-coffee-bronze/30"
                />
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-coffee-text-secondary">Loading menu...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-coffee-text-secondary">No drinks match your search</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <motion.div
                    key={item._id || item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <Link href={`/menu/${item._id || item.id}`}>
                      <div className="luxury-card overflow-hidden h-full flex flex-col">
                        {/* Image */}
                        {item.image && (
                          <div className="relative h-48 overflow-hidden bg-coffee-light">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {item.popular && (
                              <div className="absolute top-4 right-4 bg-coffee-bronze text-coffee-cream px-3 py-1 rounded-full text-xs font-medium">
                                Popular
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-heading text-lg font-bold text-coffee-text mb-2 group-hover:text-coffee-bronze transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-coffee-text-secondary mb-4 flex-1">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-xl font-bold text-coffee-bronze">
                              PKR {item.price}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(item._id || item.id || "");
                              }}
                              className="p-2 rounded-full hover:bg-coffee-light transition-colors"
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  favorites.includes(item._id || item.id || "")
                                    ? "fill-coffee-bronze text-coffee-bronze"
                                    : "text-coffee-text-secondary"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Featured */}
              <div className="luxury-card p-6">
                <h3 className="font-heading text-sm font-bold text-coffee-text mb-4">
                  Featured Favorites
                </h3>
                <div className="space-y-3">
                  {menuItems
                    .filter((item) => item.popular)
                    .slice(0, 3)
                    .map((item) => (
                      <Link key={item.id} href={`/menu/${item.id}`}>
                        <div className="p-4 rounded-luxury border border-coffee-border hover:bg-coffee-light transition-colors">
                          <p className="font-medium text-coffee-text text-sm">{item.name}</p>
                          <p className="text-xs text-coffee-text-secondary mt-1">{item.category}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Saved Drinks */}
              <div className="luxury-card p-6">
                <h3 className="font-heading text-sm font-bold text-coffee-text mb-4">
                  Saved Drinks
                </h3>
                {favorites.length > 0 ? (
                  <div className="space-y-2">
                    {favorites.map((id) => {
                      const item = menuItems.find((m) => m._id === id || m.id === id);
                      return item ? (
                        <Link key={id} href={`/menu/${id}`}>
                          <div className="p-3 rounded-lg bg-coffee-light hover:bg-coffee-light border border-coffee-border text-xs text-coffee-text truncate">
                            {item.name}
                          </div>
                        </Link>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-coffee-text-secondary">
                    Save your favorite drinks here
                  </p>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </main>
  );
}
