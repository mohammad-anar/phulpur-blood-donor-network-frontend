"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  setSelectedBloodGroup,
  setSearchLocation,
  setSearchQuery,
  resetFilter,
} from "@/lib/store/slices/filterSlice";
import { Search, MapPin, ChevronDown, User, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const bloodGroups = [
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

export function SearchSection() {
  const dispatch = useAppDispatch();
  const { selectedBloodGroup, searchLocation, searchQuery } = useAppSelector(
    (state) => state.filter
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donorsSection = document.getElementById("donors-section");
    if (donorsSection) {
      donorsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasActiveFilter =
    selectedBloodGroup !== "সব গ্রুপ" ||
    searchLocation.trim() !== "" ||
    searchQuery.trim() !== "";

  return (
    <section id="search" className="relative -mt-6 sm:-mt-8 z-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-xl hover:shadow-2xl transition-all duration-300 p-5 sm:p-7 backdrop-blur-md"
        >
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-2">
                  <Search className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>রক্তদাতা খুঁজুন</span>
                </h2>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                  রক্তের গ্রুপ, ফুলপুরের ইউনিয়ন/এলাকা বা নাম দিয়ে তাৎক্ষণিক রক্তদাতা সন্ধান করুন
                </p>
              </div>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={() => dispatch(resetFilter())}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ফিল্টার মুছুন</span>
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
              {/* 1. Blood Group Selector */}
              <div className="md:col-span-3 space-y-1.5">
                <label
                  htmlFor="bloodGroupSelect"
                  className="block text-xs font-bold text-[var(--foreground)]"
                >
                  রক্তের গ্রুপ
                </label>
                <div className="relative">
                  <select
                    id="bloodGroupSelect"
                    value={selectedBloodGroup}
                    onChange={(e) => dispatch(setSelectedBloodGroup(e.target.value))}
                    className="w-full appearance-none bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent cursor-pointer transition-colors shadow-xs"
                  >
                    {bloodGroups.map((group) => (
                      <option key={group} value={group} className="bg-[var(--card-bg)]">
                        {group}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                </div>
              </div>

              {/* 2. Location / Union Input */}
              <div className="md:col-span-3 lg:col-span-4 space-y-1.5">
                <label
                  htmlFor="locationInput"
                  className="block text-xs font-bold text-[var(--foreground)]"
                >
                  এলাকা / ইউনিয়ন
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary)]" />
                  <input
                    id="locationInput"
                    type="text"
                    placeholder="যেমন: পৌরসভা, বালিয়া, ভাইটকান্দি"
                    value={searchLocation}
                    onChange={(e) => dispatch(setSearchLocation(e.target.value))}
                    className="w-full bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors shadow-xs"
                  />
                </div>
              </div>

              {/* 3. Name or Keyword Input */}
              <div className="md:col-span-3 lg:col-span-3 space-y-1.5">
                <label
                  htmlFor="queryInput"
                  className="block text-xs font-bold text-[var(--foreground)]"
                >
                  রক্তদাতার নাম বা মোবাইল
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-subtle)]" />
                  <input
                    id="queryInput"
                    type="text"
                    placeholder="নাম বা মোবাইল নম্বর"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="w-full bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors shadow-xs"
                  />
                </div>
              </div>

              {/* 4. Search Button */}
              <div className="md:col-span-3 lg:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>খুঁজুন</span>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
