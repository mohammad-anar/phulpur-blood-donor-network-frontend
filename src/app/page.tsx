import type { Metadata } from "next";
import { HomeContent } from "./HomeContent";

const siteUrl = "https://phulpurblooddonornetwork.vercel.app";

export const metadata: Metadata = {
  title: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | Phulpur Blood Donor Network - রক্ত দিন জীবন বাঁচান",
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক (Phulpur Blood Donor Network) - ময়মনসিংহের ফুলপুর ও পার্শ্ববর্তী এলাকায় জরুরি প্রয়োজনে রক্তদাতা খুঁজুন এবং বিনামূল্যে রক্তদাতা হিসেবে নিবন্ধন করুন।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "ফুলপুর ব্লাড ডোনার",
    "phulpur blood donor network",
    "phulpur blood donor",
    "fulpur blood donor network",
    "fulpur blood donor",
    "ফুলপুর রক্তদান",
    "ফুলপুর রক্তদাতা",
    "ফুলপুর ব্লাড ব্যাংক",
    "ফুলপুরে রক্তের সন্ধান",
    "জরুরি রক্ত ফুলপুর",
    "blood donor in phulpur",
    "phulpur blood donation",
  ],
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | Phulpur Blood Donor Network",
    description:
      "জরুরি প্রয়োজনে রক্তদাতা খুঁজুন এবং রক্তদাতা হিসেবে যুক্ত হয়ে মানুষের জীবন বাঁচান। ফুলপুর, ময়মনসিংহ।",
    url: `${siteUrl}/`,
    images: [
      {
        url: `${siteUrl}/favicon.png`,
        width: 333,
        height: 478,
        alt: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | Phulpur Blood Donor Network",
    description:
      "জরুরি প্রয়োজনে রক্তদাতা খুঁজুন এবং রক্তদাতা হিসেবে যুক্ত হয়ে মানুষের জীবন বাঁচান। ফুলপুর, ময়মনসিংহ।",
    images: [`${siteUrl}/favicon.png`],
  },
};

export default function HomePage() {
  return <HomeContent />;
}
