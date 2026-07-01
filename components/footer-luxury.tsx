import Link from "next/link";
import { Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

const footerLinks = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" }
];

export default function FooterLuxury() {
  const currentYear = new Date().getFullYear();
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE ?? "+923205950705";
  const email = process.env.NEXT_PUBLIC_EMAIL ?? "9bar.pk@gmail.com";
  const foodpandaUrl = process.env.NEXT_PUBLIC_FOODPANDA ?? "https://www.foodpanda.pk/";

  return (
    <footer className="bg-coffee-dark text-coffee-cream pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-coffee-bronze to-coffee-gold rounded-md flex items-center justify-center">
                <span className="font-heading text-white text-sm font-bold">9</span>
              </div>
              <div>
                <h3 className="font-heading text-base font-bold">9 BAR</h3>
                <p className="text-xs text-coffee-cream/60">Specialty Coffee</p>
              </div>
            </div>
            <p className="text-sm text-coffee-cream/70 leading-relaxed">
              Crafted with precision. Served with passion. Experience the art of specialty coffee.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-6 text-coffee-gold">Navigate</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-coffee-cream/70 hover:text-coffee-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-6 text-coffee-gold">Hours</h4>
            <ul className="space-y-2 text-sm text-coffee-cream/70">
              <li>Monday – Friday</li>
              <li className="text-coffee-cream">07:00 – 20:00</li>
              <li className="mt-3">Saturday – Sunday</li>
              <li className="text-coffee-cream">08:00 – 18:00</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-bold mb-6 text-coffee-gold">Contact</h4>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-3 text-sm text-coffee-cream/70 hover:text-coffee-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-coffee-cream/70 hover:text-coffee-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </a>
              <a
                href={foodpandaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-coffee-cream/70 hover:text-coffee-gold transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Foodpanda</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-coffee-cream/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Faisalabad, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-coffee-brown/30 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-coffee-cream/60">
            © {currentYear} 9 BAR. All rights reserved.
          </p>
          <p className="text-sm text-coffee-cream/60">
            Crafted with passion for specialty coffee enthusiasts worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
