import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ToastProvider } from "@/components/common/Toast";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | রক্ত দিন, জীবন বাঁচান",
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - জরুরি প্রয়োজনে রক্তদাতা খুঁজুন এবং রক্তদাতা হিসেবে নিবন্ধন করে জীবন বাঁচাতে সহযোগিতা করুন। ফুলপুর, ময়মনসিংহ।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "রক্তদাতা",
    "রক্তদান",
    "ফুলপুর",
    "ময়মনসিংহ",
    "Blood Donor Network",
    "Fulpur Blood Donor",
  ],
  authors: [{ name: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক" }],
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning className={hindSiliguri.variable}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-200">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
