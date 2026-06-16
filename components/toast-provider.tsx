"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#f8f7f3",
            border: "1px solid rgba(212, 175, 55, 0.18)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)"
          }
        }}
      />
    </>
  );
}
