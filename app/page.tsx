"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Leaf, Clock, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  popular?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.2 }
};

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const products = data.products || [];
        setBestSellers(products.filter((item: MenuItem) => item.popular).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };
    fetchMenu();
  }, []);

  return (
    <main className="min-h-screen bg-coffee-cream pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-coffee-bronze/5 to-coffee-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-coffee-brown/5 to-coffee-bronze/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coffee-light border border-coffee-border">
              <div className="w-2 h-2 rounded-full bg-coffee-bronze"></div>
              <span className="text-xs font-medium text-coffee-text-secondary tracking-wider">
                SPECIALTY COFFEE CRAFTED WITH PRECISION
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-coffee-text mb-6 leading-tight"
          >
            Espresso
            <br />
            <span className="bg-gradient-to-r from-coffee-bronze to-coffee-gold bg-clip-text text-transparent">
              Excellence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-coffee-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Sourced from world-class origins, extracted to perfection. At 9 bars of pressure, we deliver specialty coffee as an art form.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/menu" className="luxury-button luxury-button-primary">
              Explore Menu <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <button className="luxury-button luxury-button-secondary">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Drinks */}
      <section className="luxury-section bg-coffee-light">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium text-coffee-bronze tracking-widest uppercase">
              House Specials
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-coffee-text mt-4 mb-4">
              Signature Selection
            </h2>
            <p className="text-coffee-text-secondary max-w-2xl mx-auto">
              Carefully curated drinks that define our commitment to excellence
            </p>
          </motion.div>

          {bestSellers.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              {bestSellers.map((drink, idx) => (
                <motion.div
                  key={drink._id || drink.id}
                  variants={fadeInUp}
                  className="luxury-card p-8"
                >
                  {drink.image && (
                    <div className="relative h-40 mb-6 rounded-luxury overflow-hidden">
                      <Image
                        src={drink.image}
                        alt={drink.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-bold text-coffee-text mb-2">
                    {drink.name}
                  </h3>
                  <p className="text-coffee-text-secondary text-sm mb-6">
                    {drink.description}
                  </p>
                  <p className="text-coffee-bronze font-heading text-lg font-bold">
                    PKR {drink.price}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-coffee-text-secondary">Loading our signature drinks...</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link href="/menu" className="luxury-button luxury-button-primary">
              View Full Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="luxury-section">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium text-coffee-bronze tracking-widest uppercase">
              Our Promise
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-coffee-text mt-4">
              Why 9 BAR
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Coffee,
                title: "Premium Beans",
                description: "Single-origin, specialty-grade beans"
              },
              {
                icon: Award,
                title: "Expert Baristas",
                description: "Precision and passion in every cup"
              },
              {
                icon: Clock,
                title: "Fresh Daily",
                description: "Roasted fresh, served within hours"
              },
              {
                icon: Leaf,
                title: "Sustainable",
                description: "Ethically sourced from fair-trade partners"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coffee-bronze/10 to-coffee-gold/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-coffee-bronze" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-coffee-text mb-3">
                    {item.title}
                  </h3>
                  <p className="text-coffee-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="luxury-section bg-gradient-to-br from-coffee-dark to-coffee-brown">
        <div className="luxury-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-coffee-cream mb-6">
              Ready for Your Perfect Cup?
            </h2>
            <p className="text-coffee-cream/80 max-w-2xl mx-auto mb-8 text-lg">
              Join coffee enthusiasts who've discovered true specialty coffee
            </p>
            <Link href="/menu" className="inline-block px-8 py-4 rounded-full bg-coffee-gold text-coffee-dark hover:bg-coffee-cream shadow-luxury hover:shadow-luxury-lg transition-all font-medium">
              Order Now
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
