import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import ThemeProvider from "@/components/theme-provider";
import FooterLuxury from "@/components/footer-luxury";
import NavbarLuxury from "@/components/navbar-luxury";
import FloatingActions from "@/components/floating-actions";
import ToastProvider from "@/components/toast-provider";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant"
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "9 BAR | Premium Specialty Coffee",
  description: "Luxury specialty coffee crafted with precision. Premium espresso, artisanal blends, and carefully curated experiences.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "9 BAR | Premium Specialty Coffee",
    description: "Luxury specialty coffee crafted with precision. Premium espresso, artisanal blends, and carefully curated experiences.",
    type: "website",
    siteName: "9 BAR",
    locale: "en_US"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F7F2EA" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${cormorant.variable} ${manrope.variable} font-body bg-coffee-cream text-coffee-text`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ToastProvider>
            <NavbarLuxury />
            {children}
            <FloatingActions />
            <FooterLuxury />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
