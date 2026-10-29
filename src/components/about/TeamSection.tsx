"use client";

import Image from "next/image";
import { Phone, Mail, ShieldCheck, Code2, Users } from "lucide-react";
import { teamMembers, TeamMember } from "@/lib/data/teamData";

export function TeamSection() {
  return (
    <section className="py-14 sm:py-20 bg-[var(--background-alt)]/60 border-t border-b border-[var(--border-color)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-2xs mb-3">
            <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>পরিচালক ও কারিগরি টিম</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight">
            আমাদের ওয়েবসাইটের সঙ্গে যুক্ত ব্যক্তিবর্গ
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
            এই উদ্যোগের পরিচালনা ও কারিগরি উন্নয়নে যাঁরা গুরুত্বপূর্ণ ভূমিকা পালন করছেন, তাঁদের পরিচিতি।
          </p>
        </div>

        {/* Profile Cards Grid - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const isOwner = member.roleType === "owner";

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
      {/* Top subtle color indicator line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 sm:h-1.5 ${
          isOwner
            ? "bg-gradient-to-r from-red-600 via-rose-500 to-red-700"
            : "bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600"
        }`}
      />

      <div>
        {/* Card Header: Badge & Role Indicator */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${
              isOwner
                ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-900/60"
                : "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-900/60"
            }`}
          >
            {isOwner ? (
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            ) : (
              <Code2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            )}
            <span>{member.badge}</span>
          </span>

          <span className="text-[11px] font-medium text-[var(--foreground-muted)] hidden sm:inline-block">
            {isOwner ? "নেতৃত্ব ও পরিচালনা" : "সফটওয়্যার ডেভেলপমেন্ট"}
          </span>
        </div>

        {/* Member Profile Main Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left mb-6">
          {/* Profile Picture */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border-3 border-white dark:border-stone-800 shadow-md ring-2 ring-[var(--color-primary)]/20 bg-stone-100 dark:bg-stone-800">
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Name & Designation */}
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] tracking-tight">
              {member.name}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-primary)]">
              {member.designation}
            </p>
            <p className="text-xs text-[var(--foreground-muted)] pt-1">
              {isOwner
                ? "ফুলপুর ব্লাড ডোনার নেটওয়ার্কের পরিচালনা ও সার্বিক সমন্বয়।"
                : "প্ল্যাটফর্মের ডিজাইন, ফিচার উন্নয়ন ও কারিগরি রক্ষণাবেক্ষণ।"}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Details List */}
      <div className="space-y-2.5 pt-4 border-t border-[var(--border-color)]">
        {/* Phone Number */}
        <a
          href={member.phoneCallUrl}
          title={`কল করুন: ${member.phone}`}
          className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[var(--background-alt)] hover:bg-[var(--color-primary-light)] border border-[var(--border-color)] hover:border-[var(--color-primary-border)] text-[var(--foreground)] hover:text-[var(--color-primary)] transition-all duration-200 group/link"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--card-bg)] flex items-center justify-center shrink-0 border border-[var(--border-color)] text-[var(--color-primary)] group-hover/link:bg-[var(--color-primary)] group-hover/link:text-white transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] block tracking-wider">
              মোবাইল নম্বর
            </span>
            <span className="text-xs sm:text-sm font-semibold font-mono truncate block">
              {member.phone}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--card-bg)] text-[var(--foreground-muted)] group-hover/link:text-[var(--color-primary)] border border-[var(--border-color)] shrink-0 hidden sm:inline-block">
            কল করুন
          </span>
        </a>

        {/* Email Address */}
        <a
          href={member.emailSendUrl}
          title={`ইমেইল পাঠান: ${member.email}`}
          className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[var(--background-alt)] hover:bg-[var(--color-primary-light)] border border-[var(--border-color)] hover:border-[var(--color-primary-border)] text-[var(--foreground)] hover:text-[var(--color-primary)] transition-all duration-200 group/link"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--card-bg)] flex items-center justify-center shrink-0 border border-[var(--border-color)] text-[var(--color-primary)] group-hover/link:bg-[var(--color-primary)] group-hover/link:text-white transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] block tracking-wider">
              ইমেইল ঠিকানা
            </span>
            <span className="text-xs sm:text-sm font-semibold font-mono truncate block">
              {member.email}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--card-bg)] text-[var(--foreground-muted)] group-hover/link:text-[var(--color-primary)] border border-[var(--border-color)] shrink-0 hidden sm:inline-block">
            বার্তা পাঠান
          </span>
        </a>

        {/* Facebook Profile */}
        {member.facebookUrl && (
          <a
            href={member.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`ফেসবুক: ${member.name}`}
            className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl bg-[var(--background-alt)] hover:bg-[#1877F2]/10 border border-[var(--border-color)] hover:border-[#1877F2]/40 text-[var(--foreground)] hover:text-[#1877F2] transition-all duration-200 group/link cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover/link:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[var(--foreground)] group-hover/link:text-[#1877F2] transition-colors">
                Facebook
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--card-bg)] text-[#1877F2] border border-[#1877F2]/30 shrink-0 hidden sm:inline-block">
              প্রোফাইল দেখুন
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
