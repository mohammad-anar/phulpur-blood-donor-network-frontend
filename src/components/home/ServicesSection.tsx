"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  CalendarDays,
  ShieldCheck,
  Users,
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const services: ServiceItem[] = [
  {
    id: "register",
    title: "ডোনার হিসেবে নিবন্ধন",
    description: "সহজেই রেজিস্ট্রেশন করুন এবং নিয়মিত রক্তদাতা হন।",
    icon: UserPlus,
  },
  {
    id: "search",
    title: "রক্তদাতা খুঁজুন",
    description: "রক্তের গ্রুপ ও অবস্থান অনুযায়ী ডোনার খুঁজে নিন।",
    icon: Search,
  },
  {
    id: "record",
    title: "রক্তদানের রেকর্ড",
    description: "কখন রক্ত দিয়েছেন এবং কতদিন বাকি তা দেখুন।",
    icon: CalendarDays,
  },
  {
    id: "security",
    title: "নিরাপদ ও বিশ্বাসযোগ্য",
    description: "আপনার তথ্য সুরক্ষিত এবং গোপনীয়তা রক্ষা করা হয়।",
    icon: ShieldCheck,
  },
  {
    id: "community",
    title: "কমিউনিটি সাপোর্ট",
    description: "একসাথে শক্তিশালী হওয়া ফুলপুরের জন্য।",
    icon: Users,
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Accent Lines */}
        <div className="flex items-center justify-center gap-4 mb-12 sm:mb-14">
          <div className="h-[2px] w-12 sm:w-16 bg-[var(--color-primary)] rounded-full opacity-60" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] text-center">
            আমাদের সেবা সমূহ
          </h2>
          <div className="h-[2px] w-12 sm:w-16 bg-[var(--color-primary)] rounded-full opacity-60" />
        </div>

        {/* 5-Column Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-[var(--border-color)]">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center px-4 py-3 group cursor-pointer"
              >
                {/* Circular Icon with Soft Red Background */}
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary-border)] flex items-center justify-center text-[var(--color-primary)] mb-5 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300 shadow-xs">
                  <Icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Service Title */}
                <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed max-w-[200px]">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
