import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক একটি মানবিক উদ্যোগ, যার লক্ষ্য স্বেচ্ছায় রক্তদানে মানুষকে উৎসাহিত করা এবং জরুরি প্রয়োজনে রক্তদাতা ও রক্তপ্রার্থীদের মধ্যে যোগাযোগ সহজ করা।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "আমাদের সম্পর্কে",
    "স্বেচ্ছায় রক্তদান",
    "ফুলপুর",
    "ময়মনসিংহ",
    "About Us",
    "Fulpur Blood Donor Network",
  ],
  openGraph: {
    title: "আমাদের সম্পর্কে | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "রক্তদানে এগিয়ে আসি, বাঁচাই মানুষের প্রাণ। ফুলপুর ব্লাড ডোনার নেটওয়ার্ক একটি মানবিক ও অলাভজনক উদ্যোগ।",
    images: ["/images/hero-illustration.png"],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
