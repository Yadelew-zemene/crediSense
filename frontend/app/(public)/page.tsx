import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { ModelStats } from "@/components/model-stats";
import { Navbar } from "@/components/navbar";
import { ResponsibleAI } from "@/components/responsible-ai";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      <ModelStats />

      <HowItWorks />

      <ResponsibleAI />

      <CtaSection />

      <Footer />
    </main>
  );
}