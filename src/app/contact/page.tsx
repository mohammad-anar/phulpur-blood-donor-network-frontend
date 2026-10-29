import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "যোগাযোগ | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  description:
    "আপনার কোনো প্রশ্ন, পরামর্শ বা সহযোগিতার প্রয়োজন হলে ফুলপুর ব্লাড ডোনার নেটওয়ার্কের সাথে যোগাযোগ করুন। আমরা আপনার মতামতকে গুরুত্ব দিই।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "যোগাযোগ",
    "রক্তদান সহায়তা",
    "ফুলপুর",
    "ময়মনসিংহ",
    "Contact Us",
    "Fulpur Blood Donor Network",
  ],
  openGraph: {
    title: "যোগাযোগ | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "আপনার কোনো প্রশ্ন, পরামর্শ বা সহযোগিতার প্রয়োজন হলে ফুলপুর ব্লাড ডোনার নেটওয়ার্কের সাথে যোগাযোগ করুন।",
    images: ["/images/hero-illustration.png"],
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
