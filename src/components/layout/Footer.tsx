"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="footer" className="bg-[var(--color-footer-bg)] text-rose-100 border-t border-[var(--color-footer-border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="relative h-12 w-48 sm:w-52 bg-white px-3 py-1.5 rounded-xl shadow-xs">
              <Image
                src="/images/ফুলপুর ব্লাড ডোনার নেটওয়ার্ক লোগো cropped.png"
                alt="ফুলপুর ব্লাড ডোনার নেটওয়ার্ক"
                fill
                sizes="208px"
                className="object-contain p-1"
              />
            </div>
            <span className="text-xs text-rose-200/90 font-medium">
              রক্ত দিন, জীবন বাঁচান
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-sm font-medium text-rose-100/90">
            <Link
              href="/"
              className="hover:text-white transition-colors"
            >
              হোম
            </Link>
            <Link
              href="/donors"
              className="hover:text-white transition-colors"
            >
              ডোনার খুঁজুন
            </Link>
            <Link
              href="/register"
              className="hover:text-white transition-colors"
            >
              রেজিস্ট্রেশন করুন
            </Link>
            <Link
              href="/about"
              className="hover:text-white transition-colors"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              যোগাযোগ
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/PhulpurBloodDonorNetwork"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ফেসবুক পেইজ"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/15 my-6 sm:my-8" />

        {/* Bottom Bar: Copyright & Policies */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-200/70">
          <p>© ২০২৪ ফুলপুর ব্লাড ডোনার নেটওয়ার্ক। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-white transition-colors">
              গোপনীয়তা নীতি
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">
              ব্যবহার শর্তাবলী
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
