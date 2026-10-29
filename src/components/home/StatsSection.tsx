"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplet, Users, Calendar, Heart, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { useGetStatsQuery } from "@/lib/store/api/bloodDonationApi";

// Convert English numerals to Bengali digits
export const toBengaliNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return "০";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

interface StatsSectionProps {
  onRegisterClick?: () => void;
}

export function StatsSection({ onRegisterClick }: StatsSectionProps) {
  const { data: stats, isLoading } = useGetStatsQuery();

  const totalDonors = stats?.totalDonors ?? 0;
  const totalDonations = stats?.totalDonations ?? 0;
  const lastDonationDaysAgo = stats?.lastDonationDaysAgo ?? 0;

  const renderLastDonationText = () => {
    if (lastDonationDaysAgo > 0) {
      return `${toBengaliNumber(lastDonationDaysAgo)} দিন আগে`;
    }
    if (totalDonations > 0) {
      return "আজকে সম্পন্ন";
    }
    return "সম্প্রতি সম্পন্ন";
  };

  return (
    <section className="py-8 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {/* Stat 1: Total Registered Donors */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary-border)] flex items-center justify-center shrink-0 text-[var(--color-primary)]">
              <Droplet className="w-7 h-7 fill-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground-muted)]">
                মোট নিবন্ধিত ডোনার
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-12 h-7 bg-red-100 dark:bg-red-950/40 rounded animate-pulse" />
                  ) : (
                    toBengaliNumber(totalDonors)
                  )}
                </span>
                <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                  জন
                </span>
              </div>
              <p className="text-[11px] text-[var(--foreground-subtle)] font-medium mt-0.5">
                যাচাইকৃত স্বেচ্ছাসেবী ডোনার
              </p>
            </div>
          </motion.div>

          {/* Stat 2: Total Successful Donations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary-border)] flex items-center justify-center shrink-0 text-[var(--color-primary)]">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground-muted)]">
                মোট সফল ডোনেশন
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-12 h-7 bg-red-100 dark:bg-red-950/40 rounded animate-pulse" />
                  ) : (
                    toBengaliNumber(totalDonations)
                  )}
                </span>
                <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                  বার
                </span>
              </div>
              <p className="text-[11px] text-[var(--foreground-subtle)] font-medium mt-0.5">
                সফলভাবে রক্তদান সম্পন্ন
              </p>
            </div>
          </motion.div>

          {/* Stat 3: Last Donation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary-border)] flex items-center justify-center shrink-0 text-[var(--color-primary)]">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground-muted)]">
                সর্বশেষ ডোনেশন
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-extrabold text-[var(--color-primary)] tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-20 h-7 bg-red-100 dark:bg-red-950/40 rounded animate-pulse" />
                  ) : (
                    renderLastDonationText()
                  )}
                </span>
              </div>
              <p className="text-[11px] text-[var(--foreground-subtle)] font-medium mt-0.5">
                ফুলপুর নেটওয়ার্ক আপডেট
              </p>
            </div>
          </motion.div>

          {/* Stat 4: Red CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[var(--color-primary)] text-white rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-white/15 shrink-0">
                <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
              </div>
              <p className="text-sm font-bold leading-snug">
                আপনার রক্ত <br />
                কাউকে দ্বিতীয় জীবন দিতে পারে
              </p>
            </div>

            <div className="mt-4 pt-2">
              <Link
                href="/register"
                onClick={(e) => {
                  if (onRegisterClick) {
                    e.preventDefault();
                    onRegisterClick();
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-white/20 hover:bg-white hover:text-[var(--color-primary)] border border-white/40 rounded-xl transition-all duration-200 cursor-pointer shadow-xs"
              >
                <span>এখনই নিবন্ধন করুন</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
