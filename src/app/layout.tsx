import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "QR Pay Manager",
  description: "Generate & manage UPI payment QR codes",
  manifest: "/manifest.json",
  // AdSense meta tag verification — Google sees this without needing JS
  other: {
    "google-adsense-account": "ca-pub-1212835646767214",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2060",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <head>
        {/* Direct script tag — Google bot reads this without executing JS */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1212835646767214"
          // @ts-ignore
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#f0f4ff] min-h-screen"
        style={{ fontFamily: "var(--font-dm), sans-serif" }}
      >
        <AuthProvider>
          <AuthGuard>
            <Navbar />
            <main>{children}</main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}