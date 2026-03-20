import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { FeaturesBento } from "@/components/landing/features-bento";
import { AIShowcase } from "@/components/landing/ai-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { LandingCTA } from "@/components/landing/landing-cta";

export default function LandingPage() {
  return (
    <div style={{ background: "#0d0f1a", fontFamily: "var(--font-jakarta), sans-serif" }}>
      <LandingNav />
      <LandingHero />
      <FeaturesBento />
      <AIShowcase />
      <HowItWorks />
      <Testimonials />
      <LandingCTA />
    </div>
  );
}
