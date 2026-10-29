"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Search, Heart } from "lucide-react";

interface HeroSectionProps {
  onRegisterClick?: () => void;
  onSearchClick?: () => void;
}

export function HeroSection({ onRegisterClick, onSearchClick }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#FFF" }}
    >
      {/* Full-width background image */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Image
          src="/images/hero_cropped_reference.png"
          alt="ফুলপুর ব্লাড ডোনার নেটওয়ার্ক হিরো ব্যাকগ্রাউন্ড"
          fill
          sizes="100vw"
          className="object-cover object-center select-none"
          priority
          quality={95}
        />
        {/* Soft left overlay so text is readable over the light background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(253,243,243,0.72) 0%, rgba(253,243,243,0.58) 40%, rgba(253,243,243,0.10) 70%, transparent 100%)",
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[520px] sm:min-h-[600px] md:min-h-[640px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full py-16 md:py-20">
          {/* Left Column: Bengali Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-xs"
              style={{
                background: "rgba(185,28,28,0.10)",
                border: "1px solid rgba(185,28,28,0.28)",
              }}
            >
              <Heart
                className="w-4 h-4 animate-pulse"
                style={{ fill: "#b91c1c", color: "#b91c1c" }}
              />
              <span className="text-sm font-semibold" style={{ color: "#b91c1c" }}>
                ফুলপুর ব্লাড ডোনার নেটওয়ার্ক
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.2]"
              style={{ color: "#1c1917" }}
            >
              একটি রক্তদান <br className="hidden sm:inline" />
              বাঁচাতে পারে{" "}
              <span className="relative inline-block" style={{ color: "#b91c1c" }}>
                বহু জীবন
                {/* Subtle highlight arc */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 opacity-40"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  style={{ color: "#b91c1c" }}
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p
              className="text-base sm:text-lg max-w-xl leading-relaxed"
              style={{ color: "#57534e" }}
            >
              ফুলপুর ব্লাড ডোনার নেটওয়ার্কে নিবন্ধন করুন একজন রক্তদাতা হিসেবে, আপনার রক্তদান
              জীবন বাঁচাতে পারে। সুস্থ থাকুন, সমাজের জন্য কাজ করুন।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary: Register as Donor */}
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-base hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "#b91c1c",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#991b1b")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#b91c1c")}
              >
                <UserPlus className="w-5 h-5" />
                <span>ডোনার হিসেবে নিবন্ধন করুন</span>
              </Link>

              {/* Secondary: Search Donor */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSearchClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold bg-transparent border-2 transition-all duration-200 cursor-pointer text-base"
                style={{
                  color: "#b91c1c",
                  borderColor: "#b91c1c",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(185,28,28,0.10)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <Search className="w-5 h-5" />
                <span>ডোনার খুঁজুন</span>
              </motion.button>
            </div>

            {/* Floating Heart Micro-animations */}
            <div className="flex items-center gap-3 pt-1">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="flex items-center justify-center w-8 h-8 rounded-full shadow-sm"
                style={{ background: "rgba(185,28,28,0.12)" }}
              >
                <Heart className="w-4 h-4" style={{ fill: "#b91c1c", color: "#b91c1c" }} />
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="flex items-center justify-center w-6 h-6 rounded-full shadow-sm"
                style={{ background: "rgba(185,28,28,0.10)" }}
              >
                <Heart className="w-3 h-3" style={{ fill: "#e11d48", color: "#e11d48" }} />
              </motion.div>
              <motion.div
                animate={{ y: [-3, 5, -3] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="flex items-center justify-center w-7 h-7 rounded-full shadow-sm"
                style={{ background: "rgba(185,28,28,0.08)" }}
              >
                <Heart className="w-3.5 h-3.5" style={{ fill: "#dc2626", color: "#dc2626" }} />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-[540px] mx-auto aspect-square sm:aspect-[4/3]">
              <Image
                src="/images/hero right sight image.png"
                alt="ফুলপুর ব্লাড ডোনার নেটওয়ার্ক হিরো ইমেজ"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 540px"
                className="object-contain object-center select-none"
                priority
                quality={95}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
