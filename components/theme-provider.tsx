"use client";

import { ReactNode, useEffect, useState } from "react";

interface ThemeProviderProps {
  attribute: string;
  defaultTheme: "dark" | "light";
  children: ReactNode;
}

export default function ThemeProvider({ attribute, defaultTheme, children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const theme = saved || defaultTheme;
    document.documentElement.classList.toggle("light", theme === "light");
    setMounted(true);
  }, [defaultTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
