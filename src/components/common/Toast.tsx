"use client";

import React from "react";
import { Toaster, toast as sonnerToast } from "sonner";

export { sonnerToast as toast };

export type ToastType = "success" | "error" | "info" | "warning";

import { useTheme } from "next-themes";

export interface ToastOptions {
  description?: string;
  duration?: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={(resolvedTheme as "light" | "dark") || "light"}
        position="top-center"
        richColors
        closeButton
        expand={false}
        duration={4000}
        toastOptions={{
          style: {
            fontFamily: "var(--font-hind-siliguri), sans-serif",
            fontSize: "14px",
            borderRadius: "14px",
          },
        }}
      />
    </>
  );
}

export function useToast() {
  return {
    toast: (
      message: string,
      type: ToastType = "info",
      title?: string,
      duration?: number
    ) => {
      const opts = {
        description: title ? message : undefined,
        duration,
      };
      const mainText = title || message;

      if (type === "success") {
        sonnerToast.success(mainText, opts);
      } else if (type === "error") {
        sonnerToast.error(mainText, opts);
      } else if (type === "warning") {
        sonnerToast.warning(mainText, opts);
      } else {
        sonnerToast.info(mainText, opts);
      }
    },
    success: (message: string, title?: string, duration?: number) => {
      if (title) {
        sonnerToast.success(title, { description: message, duration });
      } else {
        sonnerToast.success(message, { duration });
      }
    },
    error: (message: string, title?: string, duration?: number) => {
      if (title) {
        sonnerToast.error(title, { description: message, duration });
      } else {
        sonnerToast.error(message, { duration });
      }
    },
    info: (message: string, title?: string, duration?: number) => {
      if (title) {
        sonnerToast.info(title, { description: message, duration });
      } else {
        sonnerToast.info(message, { duration });
      }
    },
    warning: (message: string, title?: string, duration?: number) => {
      if (title) {
        sonnerToast.warning(title, { description: message, duration });
      } else {
        sonnerToast.warning(message, { duration });
      }
    },
  };
}

export default useToast;
