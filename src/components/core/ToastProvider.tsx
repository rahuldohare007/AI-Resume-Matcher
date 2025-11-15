"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={10}
      containerStyle={{
        bottom: 16,   // 16px from bottom
        right: 16,    // 16px from right
        zIndex: 60,
      }}
      toastOptions={{
        duration: 3500,
        className: "hot-toast",
        style: {
          padding: "10px 12px",
          borderRadius: "12px",
          border: "1px solid",
          maxWidth: "360px",
          width: "calc(100% - 24px)",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        },
        success: {
          iconTheme: { primary: "#16a34a", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
  )
}