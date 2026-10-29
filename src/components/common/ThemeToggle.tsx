"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-[var(--background-alt)] border border-[var(--border-color)] animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 text-[var(--foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 cursor-pointer"
      aria-label={isDark ? "লাইট মোডে পরিবর্তন করুন" : "ডার্ক মোডে পরিবর্তন করুন"}
      title={isDark ? "লাইট মোড" : "ডার্ক মোড"}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-[18px] h-[18px] text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
