import Link from "next/link";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import FaqAccordion from "@/components/landing/FaqAccordion";
import AdsenseAd from "@/components/AdseneseAd/AdsenseAd";
import { HomePageJsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  path: "/",
  description:
    "Create UPI payment QR codes in seconds. Manage UPI IDs, track payment history, download and share QRs — free PWA for Indian businesses.",
});

const FAQS = [
  {
    q: "What is QR Pay Manager?",
    a: "QR Pay Manager is a free web app that helps Indian merchants and shop owners generate UPI payment QR codes instantly. You can save multiple UPI IDs, add custom amounts and notes, and share QR codes with customers via GPay, PhonePe, Paytm, or any UPI app.",
  },
  {
    q: "How do I create a UPI payment QR code?",
    a: "Sign up with your mobile number, add your UPI ID (e.g. name@upi), enter the payment amount and optional note, then tap Generate. Your QR code is ready to download, print, or share instantly.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. QR Pay Manager stores your UPI profiles and payment history securely. The app works as a Progressive Web App (PWA) and can be installed on your phone for offline access.",
  },
  {
    q: "Which UPI apps are supported?",
    a: "All standard UPI apps are supported including Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, and any app that scans UPI QR codes.",
  },
];

export default function Home() {
  return (
    <>
      <HomePageJsonLd />
      <Hero />
      <Features />

      <section className="bg-white px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            How QR Pay Manager Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            QR Pay Manager simplifies UPI payments for small businesses, freelancers, and shop owners across India.
            Instead of manually sharing your UPI ID every time, generate a scannable QR code with the exact amount
            pre-filled. Customers scan the code with any UPI app and pay in seconds — no typing, no errors.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-10">
            The app lets you manage multiple UPI IDs (personal, business, shop), track your QR generation history
            by date, and install the app on your phone as a PWA for quick offline access. It is built by
            Taginus Innovations and is completely free to use.
          </p>

          <h2
            className="text-xl sm:text-2xl font-bold text-slate-800 mb-6"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 pb-10">
        <AdsenseAd format="auto" />
      </div>

      <footer className="bg-[#f0f4ff] px-4 pb-10 pt-4">
        <p className="text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} Taginus Innovations. All rights reserved.
        </p>
        <p className="text-center text-slate-400 text-xs mt-2">
          Developed By <span className="text-black font-semibold">Siddhesh Kulkarni</span>
          {" · "}
          <Link href="/privacy" className="text-slate-500 hover:text-slate-700 no-underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </>
  );
}
