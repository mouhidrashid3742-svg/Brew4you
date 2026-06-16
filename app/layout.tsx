import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/theme-provider";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import FloatingActions from "@/components/floating-actions";
import ToastProvider from "@/components/toast-provider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brew4You | Premium Coffee Crafted For You",
  description: "Luxury cloud café with hand-crafted coffee, fast delivery, and premium experiences.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Brew4You | Premium Coffee Crafted For You",
    description: "Luxury cloud café for premium coffee and fast delivery from Eden Valley, Faisalabad.",
    type: "website",
    siteName: "Brew4You",
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
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${inter.className} bg-surface text-ink`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ToastProvider>
            <Navbar />
            {children}
            <FloatingActions />
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
