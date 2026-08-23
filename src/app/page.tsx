import Hero from "@/components/landing/Hero";
import { HomePageJsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  path: "/",
  description:
    "Create UPI payment QR codes in seconds. Manage UPI IDs, track payment history, download and share QRs — free PWA for Indian businesses.",
});

export default function Home() {
  return (
    <>
      <HomePageJsonLd />
      <Hero />
    </>
  );
}
