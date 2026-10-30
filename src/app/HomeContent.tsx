"use client";

import { useState, Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { DonorsSection } from "@/components/home/DonorsSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Footer } from "@/components/layout/Footer";
import { RegisterModal } from "@/components/modals/RegisterModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { Donor } from "@/lib/store/api/bloodDonationApi";

export function HomeContent() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [contactMode, setContactMode] = useState<"call" | "message">("call");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleOpenRegister = () => {
    setIsRegisterModalOpen(true);
  };

  const handleScrollToSearch = () => {
    const searchEl = document.getElementById("search");
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToDonors = () => {
    const donorsEl = document.getElementById("donors-section");
    if (donorsEl) {
      donorsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactDonor = (donor: Donor, mode: "call" | "message") => {
    setSelectedDonor(donor);
    setContactMode(mode);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-200">
      {/* Top Header / Navigation */}
      <Navbar
        onOpenRegisterModal={handleOpenRegister}
        onOpenSearchScroll={handleScrollToSearch}
      />

      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)] animate-pulse" />}>
          {/* 1. Hero Section */}
          <HeroSection
            onRegisterClick={handleOpenRegister}
            onSearchClick={handleScrollToSearch}
          />

          {/* 5. Recent Registered Donors Cards */}
          <DonorsSection
            onContactClick={handleContactDonor}
            onViewAllClick={handleScrollToDonors}
          />

          {/* 3. Our Services Section */}
          <ServicesSection />

          {/* 4. Stats Counter & Quick CTA Banner */}
          <StatsSection onRegisterClick={handleOpenRegister} />

          {/* 6. Bottom Blood Donor Call-To-Action Banner */}
          <CtaBanner onRegisterClick={handleOpenRegister} />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <ContactModal
        donor={selectedDonor}
        mode={contactMode}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}

