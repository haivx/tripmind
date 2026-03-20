import Link from "next/link";
import { ArrowRight, MessageSquare, CalendarDays, Wallet, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHIPS = [
  { icon: MessageSquare, label: "AI Chat" },
  { icon: CalendarDays, label: "Smart Itinerary" },
  { icon: Wallet, label: "Budget Tracking" },
];

function ChatMockup() {
  return (
    <div
      className="rounded-2xl p-5 w-full max-w-sm mx-auto"
      style={{
        background: "#13162a",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="text-xs text-white/30 ml-auto">TripMind AI</span>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2.5">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#E11D48" }}>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="rounded-2xl rounded-tl-none p-3 text-sm flex-1 text-white/80" style={{ background: "rgba(255,255,255,0.06)" }}>
            I&apos;ve built your 7-day <span style={{ color: "#FB7185" }}>Tokyo</span> itinerary — temples, street food & hidden gems included.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-[80%] text-white" style={{ background: "#E11D48" }}>
            Add budget tracking please!
          </div>
        </div>
        <div className="flex gap-2.5">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#E11D48" }}>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="rounded-2xl rounded-tl-none p-3 text-sm flex-1 text-white/80" style={{ background: "rgba(255,255,255,0.06)" }}>
            Done! Budget set at <span style={{ color: "#FB7185" }}>¥200,000</span> with category breakdowns.
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
        <div className="flex-1 rounded-xl px-3 py-2 text-sm text-white/25" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          Ask anything…
        </div>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer" style={{ background: "#E11D48" }}>
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#E11D48" }} />
      <div>
        <div className="text-white font-bold text-lg leading-none">{value}</div>
        <div className="text-xs text-white/40 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export function LandingHero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-28 pb-20 px-4 overflow-hidden"
      style={{ background: "#0d0f1a" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(225,29,72,0.13) 0%, transparent 60%)" }}
      />

      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(225,29,72,0.14)", border: "1px solid rgba(225,29,72,0.38)", color: "#FB7185" }}
            >
              <Sparkles className="w-3 h-3" />
              AI Travel Planner
            </div>

            <h1
              className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-sora), sans-serif", letterSpacing: "-0.025em" }}
            >
              Plan trips with{" "}
              <span style={{ color: "#E11D48" }}>AI</span>
              <br />in minutes
            </h1>

            <p
              className="text-lg text-white/55 mb-10 max-w-md leading-relaxed"
              style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              Itineraries, places, budget tracking, and smart booking imports — all in one place. Your AI travel companion for unforgettable trips.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-10">
              {CHIPS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/70"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#E11D48" }} />
                  {label}
                </div>
              ))}
            </div>

            <Link href="/signup">
              <Button
                size="lg"
                className="text-white text-base px-8 h-14 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:opacity-95"
                style={{
                  background: "#E11D48",
                  boxShadow: "0 0 40px rgba(225,29,72,0.45)",
                  borderRadius: "12px",
                  fontFamily: "var(--font-sora), sans-serif",
                  fontWeight: 700,
                }}
              >
                Start planning free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-white/25 mt-4">No credit card required</p>

            <div className="flex flex-wrap gap-3 mt-10">
              <StatBadge value="2,500+" label="Trips planned" />
              <StatBadge value="4.9★" label="User rating" />
              <StatBadge value="Free" label="Forever plan" />
            </div>
          </div>

          {/* Right */}
          <div className="relative flex justify-center lg:justify-end">
            <ChatMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
