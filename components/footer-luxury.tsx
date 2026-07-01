import Link from "next/link";
import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";

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
    <footer className="bg-[#17110e] pt-20 pb-8 text-[#f8e8d1]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b68349_0%,#e0b77b_100%)] text-sm font-semibold text-[#fff8eb]">
                9
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-[0.24em] text-[#fff6eb]">9 BAR</h3>
                <p className="text-xs uppercase tracking-[0.28em] text-[#b89b75]">Specialty Coffee</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#d9c9b1]">
              Crafted with precision, served with warmth. Experience a refined coffee ritual built around flavor, detail, and calm.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#e0b77b]">Navigate</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#d9c9b1] transition hover:text-[#f1d2aa]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#e0b77b]">Hours</h4>
            <ul className="space-y-2 text-sm text-[#d9c9b1]">
              <li>Monday – Friday</li>
              <li className="text-[#fff6eb]">07:00 – 20:00</li>
              <li className="pt-3">Saturday – Sunday</li>
              <li className="text-[#fff6eb]">08:00 – 18:00</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#e0b77b]">Contact</h4>
            <div className="space-y-3">
              <a href={`tel:${phoneNumber}`} className="flex items-center gap-3 text-sm text-[#d9c9b1] transition hover:text-[#f1d2aa]">
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-[#d9c9b1] transition hover:text-[#f1d2aa]">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </a>
              <a href={foodpandaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-[#d9c9b1] transition hover:text-[#f1d2aa]">
                <ShoppingBag className="h-4 w-4" />
                <span>Foodpanda</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-[#d9c9b1]">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Faisalabad, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-[#4e3927]" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-[#a89475] md:flex-row">
          <p>© {currentYear} 9 BAR. All rights reserved.</p>
          <p>Crafted with passion for specialty coffee enthusiasts worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
