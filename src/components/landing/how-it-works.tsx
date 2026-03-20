import { Sparkles } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Create your trip",
    desc: "Enter your destination, travel dates, and a quick note about your travel style. Takes under 60 seconds.",
  },
  {
    num: "02",
    title: "Let AI plan it",
    desc: "Chat with Claude to generate itineraries, get local tips, import email bookings, and discover hidden gems.",
  },
  {
    num: "03",
    title: "Track & enjoy",
    desc: "Monitor your budget across currencies, get smart alerts, share with friends, and view everything on a map.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4" style={{ background: "#0d0f1a" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(225,29,72,0.12)", border: "1px solid rgba(225,29,72,0.3)", color: "#FB7185" }}
          >
            <Sparkles className="w-3 h-3" />
            How It Works
          </div>
          <h2
            className="text-4xl lg:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-sora), sans-serif", letterSpacing: "-0.02em" }}
          >
            From idea to{" "}
            <span style={{ color: "#E11D48" }}>itinerary</span>
            {" "}in minutes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative p-7 rounded-2xl group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 200ms ease",
              }}
            >
              <div
                className="text-5xl font-extrabold mb-5 leading-none"
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  color: "rgba(225,29,72,0.2)",
                  letterSpacing: "-0.04em",
                }}
              >
                {step.num}
              </div>
              <h3
                className="text-lg font-semibold text-white mb-3"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
