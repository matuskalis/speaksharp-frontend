"use client";

import {
  Navigation,
  Hero,
  Features,
  HowItWorks,
  GrammarDemo,
  Testimonials,
  Pricing,
  CTA,
  Footer,
} from "./components/landing";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-dark">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <GrammarDemo />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
