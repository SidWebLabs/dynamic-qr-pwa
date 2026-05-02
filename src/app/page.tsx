import Hero from "@/components/landing/Hero";
import QRTypeGrid from "@/components/landing/QRTypeGrid";
import Features from "@/components/landing/Features";

export default function Home() {
  return (
    <main>
      <Hero />
      <QRTypeGrid />
      <Features />
    </main>
  );
}