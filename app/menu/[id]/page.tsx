"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  image: string;
  available: boolean;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    caffeine: number;
  };
  allergens: string[];
  customizations: {
    milkOptions: { name: string; priceAdd: number }[];
    sizeOptions: { name: string; priceAdd: number }[];
    extraShots: { name: string; priceAdd: number }[];
    syrups: { name: string; priceAdd: number }[];
    toppings: { name: string; priceAdd: number }[];
  };
}

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState({
    milk: "",
    size: "",
    shots: 0,
    syrups: [] as string[],
    toppings: [] as string[]
  });

  useEffect(() => {
    if (!itemId) return;
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/products/${itemId}`);
      const data = await res.json();
      if (data.product) {
        setItem(data.product);
        // Set defaults
        if (data.product.customizations.milkOptions?.length > 0) {
          setCustomizations((prev) => ({
            ...prev,
            milk: data.product.customizations.milkOptions[0].name
          }));
        }
        if (data.product.customizations.sizeOptions?.length > 0) {
          setCustomizations((prev) => ({
            ...prev,
            size: data.product.customizations.sizeOptions[0].name
          }));
        }
      }
    } catch (error) {
      toast.error("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!item) return 0;

    let price = item.basePrice * quantity;

    // Milk
    if (customizations.milk) {
      const milk = item.customizations.milkOptions.find((m) => m.name === customizations.milk);
      if (milk) price += milk.priceAdd * quantity;
    }

    // Size
    if (customizations.size) {
      const size = item.customizations.sizeOptions.find((s) => s.name === customizations.size);
      if (size) price += size.priceAdd * quantity;
    }

    // Extra shots
    price += customizations.shots * (item.customizations.extraShots[0]?.priceAdd || 50) * quantity;

    // Syrups
    customizations.syrups.forEach((syrup) => {
      const syrupItem = item.customizations.syrups.find((s) => s.name === syrup);
      if (syrupItem) price += syrupItem.priceAdd * quantity;
    });

    // Toppings
    customizations.toppings.forEach((topping) => {
      const toppingItem = item.customizations.toppings.find((t) => t.name === topping);
      if (toppingItem) price += toppingItem.priceAdd * quantity;
    });

    return Math.round(price);
  };

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    if (!item) return;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          item: {
            itemId: item.id,
            name: item.name,
            basePrice: item.basePrice,
            customizations,
            quantity
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Added to cart!");
        router.push("/cart");
      } else {
        toast.error(data.error || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
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

  if (!item) {
    return (
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-6 py-8 text-center">
          <p className="text-ink/70 mb-6">Item not found</p>
          <Button
            onClick={() => router.push("/menu")}
            className="bg-gold hover:bg-gold/90 text-surface"
          >
            Back to Menu
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="glass-card rounded-2xl overflow-hidden p-4">
            <div className="relative h-96 bg-white/5 rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
              <p className="text-ink/70 mb-4">{item.description}</p>
              <p className="text-lg text-gold font-semibold">{item.category}</p>
            </div>

            {/* Nutritional Info */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-bold mb-3">Nutritional Info (per serving)</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-ink/60">Calories</p>
                  <p className="font-semibold text-lg">{item.nutritionalInfo.calories}</p>
                </div>
                <div>
                  <p className="text-ink/60">Caffeine</p>
                  <p className="font-semibold text-lg">{item.nutritionalInfo.caffeine}mg</p>
                </div>
                <div>
                  <p className="text-ink/60">Protein</p>
                  <p className="font-semibold text-lg">{item.nutritionalInfo.protein}g</p>
                </div>
                <div>
                  <p className="text-ink/60">Carbs</p>
                  <p className="font-semibold text-lg">{item.nutritionalInfo.carbs}g</p>
                </div>
              </div>
            </div>

            {/* Customizations */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Customize Your Drink</h3>

              {/* Milk Options */}
              {item.customizations.milkOptions?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Milk Type</label>
                  <div className="space-y-2">
                    {item.customizations.milkOptions.map((milk) => (
                      <label key={milk.name} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                        <input
                          type="radio"
                          name="milk"
                          value={milk.name}
                          checked={customizations.milk === milk.name}
                          onChange={(e) => setCustomizations({ ...customizations, milk: e.target.value })}
                          className="h-4 w-4"
                        />
                        <span className="flex-1">{milk.name}</span>
                        {milk.priceAdd > 0 && <span className="text-gold">+PKR {milk.priceAdd}</span>}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {item.customizations.sizeOptions?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <div className="space-y-2">
                    {item.customizations.sizeOptions.map((size) => (
                      <label key={size.name} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                        <input
                          type="radio"
                          name="size"
                          value={size.name}
                          checked={customizations.size === size.name}
                          onChange={(e) => setCustomizations({ ...customizations, size: e.target.value })}
                          className="h-4 w-4"
                        />
                        <span className="flex-1">{size.name}</span>
                        {size.priceAdd > 0 && <span className="text-gold">+PKR {size.priceAdd}</span>}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Shots */}
              {item.customizations.extraShots?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Extra Shots</label>
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <button
                      onClick={() => setCustomizations({ ...customizations, shots: Math.max(0, customizations.shots - 1) })}
                      className="p-1 hover:bg-gold/20 rounded-lg transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{customizations.shots}</span>
                    <button
                      onClick={() => setCustomizations({ ...customizations, shots: customizations.shots + 1 })}
                      className="p-1 hover:bg-gold/20 rounded-lg transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {item.customizations.extraShots[0] && (
                      <span className="ml-auto text-gold text-sm">+PKR {item.customizations.extraShots[0].priceAdd}/shot</span>
                    )}
                  </div>
                </div>
              )}

              {/* Syrups */}
              {item.customizations.syrups?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Syrups</label>
                  <div className="space-y-2">
                    {item.customizations.syrups.map((syrup) => (
                      <label key={syrup.name} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={customizations.syrups.includes(syrup.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomizations({
                                ...customizations,
                                syrups: [...customizations.syrups, syrup.name]
                              });
                            } else {
                              setCustomizations({
                                ...customizations,
                                syrups: customizations.syrups.filter((s) => s !== syrup.name)
                              });
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <span className="flex-1">{syrup.name}</span>
                        <span className="text-gold">+PKR {syrup.priceAdd}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Toppings */}
              {item.customizations.toppings?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Toppings</label>
                  <div className="space-y-2">
                    {item.customizations.toppings.map((topping) => (
                      <label key={topping.name} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={customizations.toppings.includes(topping.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomizations({
                                ...customizations,
                                toppings: [...customizations.toppings, topping.name]
                              });
                            } else {
                              setCustomizations({
                                ...customizations,
                                toppings: customizations.toppings.filter((t) => t !== topping.name)
                              });
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <span className="flex-1">{topping.name}</span>
                        <span className="text-gold">+PKR {topping.priceAdd}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:bg-gold/20 rounded-lg transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:bg-gold/20 rounded-lg transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg text-ink/70">Total Price:</span>
                <span className="text-3xl font-bold text-gold">PKR {calculatePrice()}</span>
              </div>
              <Button
                onClick={addToCart}
                className="w-full h-12 bg-gold hover:bg-gold/90 text-surface font-semibold rounded-lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
