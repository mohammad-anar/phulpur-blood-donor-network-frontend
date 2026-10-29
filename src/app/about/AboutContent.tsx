"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Droplet,
  Heart,
  Search,
  UserPlus,
  Users,
  HandHeart,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowRight,
  Info,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TeamSection } from "@/components/about/TeamSection";

export function AboutContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-[var(--border-color)] bg-[var(--card-bg)]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-[var(--foreground-muted)]">
              <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
                হোম
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)]" />
              <span className="text-[var(--color-primary)] font-medium">আমাদের সম্পর্কে</span>
            </nav>
          </div>
        </div>

        {/* =====================================================
            SECTION A: HERO — আমাদের সম্পর্কে
        ====================================================== */}
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 border-b border-[var(--border-color)]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Bengali Info & CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-7 space-y-6 text-left"
              >
                {/* Eyebrow Label */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs">
                  <Droplet className="w-4 h-4 fill-current" />
                  <span>আমাদের পরিচয়</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] leading-[1.25] tracking-tight">
                  রক্তদানে এগিয়ে আসি,{" "}
                  <span className="text-[var(--color-primary)] inline-block">
                    বাঁচাই মানুষের প্রাণ
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg text-[var(--foreground-muted)] leading-relaxed max-w-2xl">
                  ফুলপুর ব্লাড ডোনার নেটওয়ার্ক একটি মানবিক উদ্যোগ, যার লক্ষ্য স্বেচ্ছায় রক্তদানে মানুষকে
                  উৎসাহিত করা এবং জরুরি প্রয়োজনে রক্তদাতা ও রক্তপ্রার্থীদের মধ্যে যোগাযোগ সহজ করা।
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/donors"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-base hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>রক্তদাতা খুঁজুন</span>
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary-light)] transition-all duration-200 cursor-pointer text-base hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>রক্তদাতা হতে চাই</span>
                  </Link>
                </div>

                {/* Micro trust indicators */}
                <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[var(--foreground-subtle)] font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    স্বেচ্ছাসেবী ও অলাভজনক উদ্যোগ
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    ফুলপুর, ময়মনসিংহ কেন্দ্রিক
                  </span>
                </div>
              </motion.div>

              {/* Right Column: Visual illustration & floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="lg:col-span-5 flex flex-col items-center justify-center relative"
              >
                <div className="relative w-full max-w-[420px] aspect-square rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-[var(--card-bg)] border border-[var(--card-border)] shadow-lg flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/hero-illustration.png"
                      alt="ফুলপুর ব্লাড ডোনার নেটওয়ার্ক"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      className="object-contain select-none p-2"
                      priority
                    />
                  </div>

                  {/* Supporting Visual Badge */}
                  <div className="absolute -bottom-4 sm:-bottom-5 bg-[var(--card-bg)] border border-[var(--color-primary-border)] px-4 sm:px-5 py-2.5 rounded-full shadow-md flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
                      মানবতার পাশে, রক্তদানে একসাথে
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION B: আমাদের লক্ষ্য ও উদ্দেশ্য
        ====================================================== */}
        <section className="py-14 sm:py-20 bg-[var(--background-alt)]/60 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                লক্ষ্য ও দৃষ্টিভঙ্গি
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)]">
                আমাদের লক্ষ্য ও উদ্দেশ্য
              </h2>
              <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
                একটি সচেতন ও মানবিক সমাজ গড়ে তুলতে স্বেচ্ছায় রক্তদান এবং মানুষের পাশে দাঁড়ানোর মানসিকতা ছড়িয়ে দেওয়াই আমাদের লক্ষ্য।
              </p>
            </div>

            {/* Three Visually Distinct Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div className="group relative bg-[var(--card-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-rose-200 dark:text-rose-900/60 font-mono">
                    ০১
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                  রক্তদাতা ও রক্তপ্রার্থীর সংযোগ
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  প্রয়োজনের সময় উপযুক্ত রক্তদাতার তথ্য খুঁজে পাওয়া এবং যোগাযোগের প্রক্রিয়াকে সহজ করা।
                </p>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-[var(--card-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-3xl font-black text-rose-200 dark:text-rose-900/60 font-mono">
                    ০২
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                  স্বেচ্ছায় রক্তদানে উৎসাহ
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  নিয়মিত সচেতনতা তৈরি করা এবং নিরাপদ, স্বেচ্ছামূলক রক্তদানের গুরুত্ব তুলে ধরা।
                </p>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-[var(--card-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <HandHeart className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-rose-200 dark:text-rose-900/60 font-mono">
                    ০৩
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                  মানবিক সহযোগিতা
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  ফুলপুর ও আশপাশের এলাকার মানুষের মধ্যে পারস্পরিক সহযোগিতা এবং সামাজিক দায়বদ্ধতা বৃদ্ধি করা।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION C: কেন এই উদ্যোগ? (সমস্যা ও আমাদের সমাধান)
        ====================================================== */}
        <section className="py-14 sm:py-20 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                বাস্তব প্রেক্ষাপট
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)]">
                কেন আমাদের এই উদ্যোগ?
              </h2>
              <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
                জরুরি মুহূর্তে রক্তের প্রয়োজন দেখা দিলে মানুষ অনেক সময় দিশেহারা হয়ে পড়ে। সেই সংকট কাটাতেই আমাদের এই স্বেচ্ছাসেবী প্রয়াস।
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Challenge / Problem Card */}
              <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 rounded-2xl p-7 sm:p-9 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 mb-5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>বিদ্যমান সমস্যা</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4">
                    জরুরি সময়ে রক্তদাতার সন্ধান পাওয়া কঠিন
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed mb-4">
                    জরুরি সময়ে রক্তদাতা খুঁজে পাওয়া, নির্ভরযোগ্য যোগাযোগের তথ্য সংগ্রহ করা এবং দ্রুত সাড়া পাওয়া অনেক সময় কঠিন হয়ে পড়ে।
                  </p>
                  <p className="text-sm text-[var(--foreground-subtle)] leading-relaxed">
                    সঠিক তথ্যের অভাব এবং যোগাযোগের সমন্বয়হীনতার কারণে অনেক সময় মূল্যবান সময় নষ্ট হয়, যা রোগীর জন্য অত্যন্ত সংকটজনক হতে পারে।
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-rose-200/60 dark:border-rose-900/30 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>জরুরি মুহূর্তে সময়ই জীবন</span>
                </div>
              </div>

              {/* Solution / Our Initiative Card */}
              <div className="bg-[var(--card-bg)] border-2 border-[var(--color-primary-border)] rounded-2xl p-7 sm:p-9 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-light)] rounded-bl-full -z-0 opacity-50" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>আমাদের উদ্যোগ ও সমাধান</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4">
                    একটি ঐক্যবদ্ধ কমিউনিটি প্ল্যাটফর্ম
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed mb-4">
                    রক্তদাতাদের তথ্য সংগঠিত করা, প্রয়োজনীয় রক্তের অনুরোধ প্রকাশ করা এবং রক্তদাতা ও রক্তপ্রার্থীদের মধ্যে যোগাযোগ সহজ করতে একটি কমিউনিটি প্ল্যাটফর্ম তৈরি করা।
                  </p>
                  <p className="text-sm text-[var(--foreground-subtle)] leading-relaxed">
                    আমরা কোনো রক্ত ব্যাংক বা বাণিজ্যিক প্রতিষ্ঠান নই; ফুলপুরবাসীর সুবিধার্থে এটি রক্তদাতাদের সরাসরি খুঁজে পাওয়ার একটি সহজ ডিজিটাল সমন্বয় কেন্দ্র।
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-6 border-t border-[var(--border-color)] flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>স্বেচ্ছাসেবী মনোভাব ও মানবিক দায়িত্ববোধ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION D: আমাদের মূলনীতি
        ====================================================== */}
        <section className="py-14 sm:py-20 bg-[var(--background-alt)]/60 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                নৈতিক ভিত্তি
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)]">
                আমাদের মূলনীতি
              </h2>
              <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
                যে চারটি মূল স্তম্ভের ওপর ফুলপুর ব্লাড ডোনার নেটওয়ার্কের প্রতিটি কার্যক্রম পরিচালিত হয়।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Principle 1 */}
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] shadow-xs hover:border-[var(--color-primary-border)] hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-[var(--color-primary)] flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 fill-rose-600 dark:fill-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  মানবিকতা
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  মানুষের বিপদে পাশে দাঁড়ানো।
                </p>
              </div>

              {/* Principle 2 */}
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] shadow-xs hover:border-[var(--color-primary-border)] hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-[var(--color-primary)] flex items-center justify-center mb-4">
                  <HandHeart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  স্বেচ্ছাসেবা
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  স্বেচ্ছায় এবং দায়িত্বশীলভাবে সহযোগিতা করা।
                </p>
              </div>

              {/* Principle 3 */}
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] shadow-xs hover:border-[var(--color-primary-border)] hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-[var(--color-primary)] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  বিশ্বস্ততা
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  তথ্যের যথাযথ ব্যবহার এবং দায়িত্বশীল যোগাযোগ।
                </p>
              </div>

              {/* Principle 4 */}
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] shadow-xs hover:border-[var(--color-primary-border)] hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-[var(--color-primary)] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  সচেতনতা
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  রক্তদান সম্পর্কে সঠিক ধারণা ছড়িয়ে দেওয়া।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION E: কীভাবে আমরা কাজ করি? (প্রক্রিয়া)
        ====================================================== */}
        <section className="py-14 sm:py-20 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                সহজ কার্যপ্রণালী
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)]">
                কীভাবে আমরা কাজ করি?
              </h2>
              <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
                একটি সুনির্দিষ্ট এবং স্বচ্ছ চার ধাপের মাধ্যমে আমরা রক্তদাতা ও গ্রহীতার সেতুবন্ধন তৈরি করি।
              </p>
            </div>

            {/* Horizontal timeline on desktop, vertical on mobile */}
            <div className="relative">
              {/* Connector line for desktop */}
              <div
                className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-rose-200 dark:bg-rose-900/40 -translate-y-8 -z-0"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)] shadow-xs flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center shadow-md mb-4 ring-4 ring-rose-100 dark:ring-rose-950">
                    ১
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2">
                    রক্তদাতা নিবন্ধন
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                    আগ্রহী ব্যক্তি নিজের তথ্য ও রক্তের গ্রুপ দিয়ে স্বেচ্ছায় নিবন্ধন করেন।
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)] shadow-xs flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center shadow-md mb-4 ring-4 ring-rose-100 dark:ring-rose-950">
                    ২
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2">
                    তথ্য যাচাই
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                    প্রযোজ্য ক্ষেত্রে অ্যাডমিন রক্তদাতার তথ্য যাচাই ও অনুমোদন করেন।
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)] shadow-xs flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center shadow-md mb-4 ring-4 ring-rose-100 dark:ring-rose-950">
                    ৩
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2">
                    রক্তদাতা অনুসন্ধান
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                    ব্যবহারকারী প্রয়োজনীয় রক্তের গ্রুপ অনুযায়ী উপলব্ধ তথ্য খুঁজে দেখেন।
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)] shadow-xs flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center shadow-md mb-4 ring-4 ring-rose-100 dark:ring-rose-950">
                    ৪
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2">
                    সরাসরি যোগাযোগ
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                    রক্তপ্রার্থী রক্তদাতার সঙ্গে সরাসরি যোগাযোগ করে প্রয়োজনীয় ব্যবস্থা নেন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION F: আমাদের কমিউনিটি (CTA)
        ====================================================== */}
        <section className="py-14 sm:py-20 bg-gradient-to-b from-[var(--background)] to-[var(--background-alt)] border-b border-[var(--border-color)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[var(--color-footer-bg)] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[var(--color-footer-border)] text-center relative overflow-hidden">
              {/* Decorative blood glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-rose-200 border border-white/15">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>সামাজিক বন্ধন</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  একসাথে গড়ি মানবিক কমিউনিটি
                </h2>

                <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
                  আপনার একটি স্বেচ্ছামূলক উদ্যোগ কারও কঠিন সময়ে আশার কারণ হতে পারে। রক্তদাতা হিসেবে যুক্ত হন অথবা আপনার পরিচিতদের রক্তদানে উৎসাহিত করুন।
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-white text-[var(--color-primary)] hover:bg-rose-50 shadow-md transition-all duration-200 cursor-pointer text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>রক্তদাতা হিসেবে যুক্ত হন</span>
                  </Link>

                  <Link
                    href="/donors"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200 cursor-pointer text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4" />
                    <span>জরুরি রক্তের অনুরোধ দেখুন</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION G: TRUST AND SAFETY NOTICE
        ====================================================== */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl p-6 sm:p-8 bg-red-400 dark:bg-red-900 border border-amber-200/70 dark:border-amber-900/40 text-[var(--foreground)] space-y-3">
              <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-600">
                <Info className="w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold">
                  নিরাপদ রক্তদান, সচেতন সিদ্ধান্ত
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                রক্তদানের আগে নিজের শারীরিক অবস্থা ও যোগ্যতা সম্পর্কে চিকিৎসক বা সংশ্লিষ্ট স্বাস্থ্যকর্মীর পরামর্শ নিন। রক্তদাতা ও রক্তপ্রার্থী উভয়েরই তথ্যের গোপনীয়তা ও নিরাপত্তার প্রতি সচেতন থাকা জরুরি। এই প্ল্যাটফর্ম মূলত যোগাযোগ সহজ করার জন্য; এটি চিকিৎসা পরামর্শ বা জরুরি চিকিৎসাসেবার বিকল্প নয়।
              </p>
            </div>
          </div>
        </section>
        {/* =====================================================
            SECTION H: পরিচালনাকারী ও ওয়েবসাইট ডেভেলপারের পরিচিতি
        ====================================================== */}
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
}
