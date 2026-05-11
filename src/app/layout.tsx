import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

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
  title: "QR Pay",
  description: "Generate & manage UPI payment QR codes",
  manifest: "/manifest.json",

  icons: {
    icon: "/QR_Pay.png",
    shortcut: "/QR_Pay.png",
    apple: "/QR_Pay.png",
  },

  openGraph: {
    title: "QR Pay",
    description: "Generate & manage UPI payment QR codes",
    images: ["/QR_PAy.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2060",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body
        className="bg-[#f0f4ff] min-h-screen"
        style={{ fontFamily: "var(--font-dm), sans-serif" }}
      > <Navbar /> <main>{children}</main> </body> </html>
  );
}
