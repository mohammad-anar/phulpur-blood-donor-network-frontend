"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Calendar,
  MessageSquare,
  ArrowRight,
  PhoneCall,
  UserCheck,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplet,
} from "lucide-react";
import { useGetDonorsQuery, Donor } from "@/lib/store/api/bloodDonationApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  setSelectedBloodGroup,
  setSearchLocation,
  setSearchQuery,
  setOnlyAvailable,
  resetFilter,
} from "@/lib/store/slices/filterSlice";

const BLOOD_GROUPS = [
  "সব গ্রুপ",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

interface DonorsSectionProps {
  onContactClick?: (donor: Donor, mode: "call" | "message") => void;
  onViewAllClick?: () => void;
}

export function DonorsSection({ onContactClick, onViewAllClick }: DonorsSectionProps) {
  const dispatch = useAppDispatch();
  const { selectedBloodGroup, searchLocation, searchQuery, onlyAvailable } =
    useAppSelector((state) => state.filter);

  // Fetch recent donors from backend API with active search & filter parameters
  const { data: donors, isLoading, isFetching } = useGetDonorsQuery({
    bloodGroup: selectedBloodGroup,
    location: searchLocation,
    searchQuery: searchQuery,
    onlyAvailable: onlyAvailable,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const hasActiveFilter =
    selectedBloodGroup !== "সব গ্রুপ" ||
    searchLocation.trim() !== "" ||
    searchQuery.trim() !== "" ||
    onlyAvailable;

  return (
    <section id="donors-section" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/50 text-[var(--color-primary)] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>রক্তদাতা নেটওয়ার্ক</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
              সাম্প্রতিক নিবন্ধিত ডোনার
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl">
              ফুলপুর উপজেলায় জীবন বাঁচাতে প্রস্তুত রক্তদাতাদের তালিকা। রক্ত প্রয়োজন হলে সরাসরি কল বা মেসেজ দিন।
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => dispatch(resetFilter())}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ফিল্টার রিসেট</span>
              </button>
            )}

            <Link
              href="/donors"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer group"
            >
              <span>সব ডোনার দেখুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 1. Top Search & Filter Bar directly inside this section */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-4 sm:p-5 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-subtle)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="রক্তদাতার নাম, এলাকা বা মোবাইল দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(""))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Available Only Toggle */}
            <button
              type="button"
              onClick={() => dispatch(setOnlyAvailable(!onlyAvailable))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                onlyAvailable
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-[var(--background-alt)] text-[var(--foreground-muted)] border-[var(--border-color)] hover:border-emerald-500/50"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>শুধুমাত্র রক্তদানে প্রস্তুত</span>
            </button>
          </div>

          {/* Blood Group Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs font-bold text-[var(--foreground-muted)] shrink-0 mr-1 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>গ্রুপ:</span>
            </span>
            {BLOOD_GROUPS.map((group) => {
              const isSelected = selectedBloodGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => dispatch(setSelectedBloodGroup(group))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-[var(--color-primary)] text-white shadow-xs scale-105"
                      : "bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>

          {/* Active Filter Info & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--foreground-muted)]">
            <div className="flex items-center gap-2">
              <span>ফলাফল:</span>
              <strong className="text-[var(--foreground)] font-bold">
                {isLoading || isFetching ? "অনুসন্ধান চলছে..." : `${donors?.length || 0} জন রক্তদাতা`}
              </strong>
            </div>

            {searchLocation && (
              <span className="px-2 py-0.5 rounded-md bg-[var(--background-alt)] border border-[var(--border-color)]">
                অবস্থান: <strong>{searchLocation}</strong>
              </span>
            )}
          </div>
        </div>

        {/* 2. Donors Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-800 mx-auto" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-2/3 mx-auto" />
                </div>
                <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : donors && donors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {donors.map((donor, idx) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  whileHover={{ y: -4 }}
                  className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between relative group"
                >
                  {/* Top: Avatar and Blood Group Badge */}
                  <div>
                    <div className="flex justify-center mb-4 relative">
                      <div className="relative">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-primary-light)] shadow-xs bg-[var(--background-alt)]">
                          <Image
                            src={donor.avatarUrl || "/images/donors/default.jpg"}
                            alt={donor.name}
                            fill
                            sizes="80px"
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Blood Group Badge */}
                        <div className="absolute -top-1 -right-2 min-w-[34px] h-[34px] px-2 rounded-full bg-[var(--color-primary)] text-white text-xs font-black flex items-center justify-center shadow-md border-2 border-[var(--card-bg)]">
                          {donor.bloodGroup}
                        </div>
                      </div>
                    </div>

                    {/* Donor Details */}
                    <div className="text-center space-y-2 mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                        {donor.name}
                      </h3>

                      <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                        <span className="truncate max-w-[200px]">{donor.location}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)] font-medium">
                        <Phone className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                        <span dir="ltr" className="font-mono font-semibold">
                          {donor.phone}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-subtle)]">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>শেষ রক্তদান: {donor.lastDonationDate}</span>
                      </div>

                      {/* Availability Badge */}
                      <div className="pt-2">
                        {donor.available || !donor.daysRemaining || donor.daysRemaining <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>রক্তদানে প্রস্তুত</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Clock className="w-3.5 h-3.5" />
                            <span>আর বাকি: {donor.daysRemaining} দিন</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons: Call & Message */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-subtle)]">
                    {/* Call Button */}
                    <button
                      type="button"
                      onClick={() => onContactClick?.(donor, "call")}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>কল করুন</span>
                    </button>

                    {/* Message Button */}
                    <button
                      type="button"
                      onClick={() => onContactClick?.(donor, "message")}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>মেসেজ</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-12 sm:p-16 text-center bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 text-[var(--color-primary)] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                কোনো রক্তদাতা খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
                আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো রক্তদাতা পাওয়া যায়নি। অন্য রক্তের গ্রুপ বা এলাকা দিয়ে অনুসন্ধান করুন।
              </p>
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => dispatch(resetFilter())}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all text-xs cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>সকল রক্তদাতা প্রদর্শন করুন</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
