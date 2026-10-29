"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplet, ArrowRight, Heart } from "lucide-react";

interface CtaBannerProps {
  onRegisterClick?: () => void;
}

export function CtaBanner({ onRegisterClick }: CtaBannerProps) {
  return (
    <section id="register" className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#700d14] via-[#8c121b] to-[#690b12] text-white p-8 sm:p-10 lg:p-12 shadow-xl">
          {/* Subtle Background Watermark Patterns */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 max-w-2xl">
              {/* Droplet Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-white fill-white animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  আপনিও হোন একজন রক্তদাতা
                </h2>
                <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
                  একটু সহযোগিতা, অনেক জীবনের আশা। <br className="hidden sm:inline" />
                  আজই নিবন্ধন করুন এবং নিয়মিত রক্তদানে অংশ নিন।
                </p>
              </div>
            </div>

            {/* Right Action & ECG Heartbeat Line */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* White CTA Button with Red Text */}
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[var(--color-primary)] bg-white hover:bg-rose-50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-sm sm:text-base hover:scale-[1.04] active:scale-[0.98]"
              >
                <span>ডোনার হিসেবে নিবন্ধন করুন</span>
                <ArrowRight className="w-4 h-4 text-[var(--color-primary)]" />
              </Link>

              {/* Heartbeat Pulse Line Graphic */}
              <div className="hidden xl:flex items-center text-white/70 gap-2">
                <svg className="w-24 h-8 text-white/60" viewBox="0 0 100 30" fill="none">
                  <path
                    d="M0 15 H 25 L 35 5 L 45 25 L 55 10 L 65 20 L 75 15 H 100"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Heart className="w-6 h-6 text-white fill-white/80 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
