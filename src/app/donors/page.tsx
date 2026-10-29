"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Phone,
  Calendar,
  PhoneCall,
  MessageSquare,
  Filter,
  CheckCircle2,
  Clock,
  Droplet,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactModal } from "@/components/modals/ContactModal";
import { RegisterModal } from "@/components/modals/RegisterModal";
import { useGetDonorsQuery, Donor } from "@/lib/store/api/bloodDonationApi";

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

export default function DonorsPage() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("সব গ্রুপ");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [contactMode, setContactMode] = useState<"call" | "message">("call");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Fetch only available donors
  const { data: allDonors, isLoading } = useGetDonorsQuery({
    onlyAvailable: true,
  });

  // Filter donors by blood group and search query (name or phone number)
  const filteredDonors = useMemo(() => {
    if (!allDonors) return [];
    return allDonors.filter((donor) => {
      // Must be available or countdown 0
      const isAvailable = donor.available || !donor.daysRemaining || donor.daysRemaining <= 0;
      if (!isAvailable) return false;

      // Blood group filter
      const matchesBlood =
        selectedBloodGroup === "সব গ্রুপ" || donor.bloodGroup === selectedBloodGroup;

      // Name or Phone or Location search
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        q === "" ||
        donor.name.toLowerCase().includes(q) ||
        donor.phone.includes(q) ||
        donor.location.toLowerCase().includes(q) ||
        donor.bloodGroup.toLowerCase().includes(q);

      return matchesBlood && matchesQuery;
    });
  }, [allDonors, selectedBloodGroup, searchQuery]);

  const handleContactDonor = (donor: Donor, mode: "call" | "message") => {
    setSelectedDonor(donor);
    setContactMode(mode);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-200">
      <Navbar
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Breadcrumb & Heading */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল পাতায় ফিরে যান</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>বর্তমানে সক্রিয় ও উপলদ্ধ রক্তদাতা তালিকা</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                  রক্তদাতা খুঁজুন
                </h1>
                <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl mt-1">
                  এখানে আমাদের নিবন্ধিত এবং উপলদ্ধ রক্তদাতাদের তথ্য দেখানো হলো। যেকোনো জরুরি প্রয়োজনে আপনি সরাসরি ফোন বা মেসেজে যোগাযোগ করতে পারেন।
                </p>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="self-start md:self-auto px-5 py-2.5 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-all text-xs cursor-pointer"
              >
                + ডোনার হিসেবে নিবন্ধন করুন
              </button>
            </div>
          </div>

          {/* Search Bar & Blood Group Pills Filter */}
          <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-md space-y-5">
            {/* Search Input for Name or Phone Number */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="রক্তদাতার নাম, মোবাইল নম্বর অথবা এলাকা লিখে খুঁজুন (যেমন: রফিকুল বা ০১৭১২)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--background-alt)] text-sm rounded-xl border border-[var(--border-color)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>

              {(searchQuery || selectedBloodGroup !== "সব গ্রুপ") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedBloodGroup("সব গ্রুপ");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-tint)] transition-colors self-end sm:self-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিসেট</span>
                </button>
              )}
            </div>

            {/* Blood Group Selectable Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground-muted)]">
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>রক্তের গ্রুপ দিয়ে ফিল্টার করুন:</span>
                </span>
                <span>
                  মোট উপলদ্ধ:{" "}
                  <strong className="text-[var(--color-primary)]">
                    {filteredDonors.length} জন
                  </strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {bloodGroups.map((group) => {
                  const isActive = selectedBloodGroup === group;
                  return (
                    <button
                      key={group}
                      onClick={() => setSelectedBloodGroup(group)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs ${
                        isActive
                          ? "bg-[var(--color-primary)] text-white shadow-sm scale-105"
                          : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] border border-[var(--border-color)]"
                      }`}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Donors Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse"
                />
              ))}
            </div>
          ) : filteredDonors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDonors.map((donor, idx) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between"
                >
                  {/* Avatar and Blood Group Badge */}
                  <div className="flex justify-center mb-4 relative">
                    <div className="relative">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--card-border)] shadow-xs bg-[var(--background-alt)]">
                        <Image
                          src={donor.avatarUrl || "/images/donors/default.jpg"}
                          alt={donor.name}
                          fill
                          sizes="80px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      {/* Blood Group Badge */}
                      <div className="absolute -top-1 -right-2 min-w-[34px] h-[34px] px-2 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shadow-md border-2 border-[var(--card-bg)]">
                        {donor.bloodGroup}
                      </div>
                    </div>
                  </div>

                  {/* Donor Details */}
                  <div className="text-center space-y-2 mb-4">
                    <h3 className="text-lg font-bold text-[var(--foreground)]">
                      {donor.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                      <span>{donor.location}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)] font-medium">
                      <Phone className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                      <span dir="ltr">{donor.phone}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-subtle)]">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
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

                  {/* Card Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
                    {/* Call Button */}
                    <button
                      onClick={() => handleContactDonor(donor, "call")}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] transition-colors cursor-pointer shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>কল করুন</span>
                    </button>

                    {/* Message Button */}
                    <button
                      onClick={() => handleContactDonor(donor, "message")}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>মেসেজ</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] space-y-3">
              <Droplet className="w-12 h-12 text-[var(--color-primary)]/40 mx-auto" />
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                কোনো রক্তদাতা পাওয়া যায়নি
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] max-w-md mx-auto">
                আপনার খোঁজা নাম, মোবাইল নম্বর বা রক্তের গ্রুপ অনুযায়ী এই মুহূর্তে কোনো ডোনার পাওয়া যায়নি। দয়া করে অন্য কোনো গ্রুপ অথবা বানান পরীক্ষা করে পুনরায় অনুসন্ধান করুন।
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBloodGroup("সব গ্রুপ");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-tint)] transition-colors cursor-pointer"
              >
                সব ডোনার প্রদর্শন করুন
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <ContactModal
        donor={selectedDonor}
        mode={contactMode}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
