import {
  MessageSquare, CalendarDays, MapPin, Wallet,
  Mail, Bell, Map, Share2, Sparkles,
} from "lucide-react";

const CARD_BASE: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "28px",
  transition: "all 200ms ease",
  cursor: "default",
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  children?: React.ReactNode;
  className?: string;
  accent?: boolean;
}

function FeatureCard({ icon: Icon, title, desc, children, className = "", accent }: FeatureCardProps) {
  return (
    <div
      className={`group ${className}`}
      style={{
        ...CARD_BASE,
        ...(accent
          ? { background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.22)" }
          : {}),
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: accent ? "rgba(225,29,72,0.2)" : "rgba(255,255,255,0.07)" }}
      >
        <Icon className="w-5 h-5" style={{ color: accent ? "#E11D48" : "#FB7185" }} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed mb-4">{desc}</p>
      {children}
    </div>
  );
}

function BudgetMini() {
  const bars = [
    { label: "Hotels", pct: 72, color: "#E11D48" },
    { label: "Food", pct: 45, color: "#FB7185" },
    { label: "Transport", pct: 28, color: "rgba(251,113,133,0.5)" },
  ];
  return (
    <div className="space-y-2.5 mt-1">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>{b.label}</span><span>{b.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${b.pct}%`, background: b.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ItineraryMini() {
  const days = ["Day 1 · Shibuya & Harajuku", "Day 2 · Temples & Ueno", "Day 3 · Akihabara"];
  return (
    <div className="space-y-2 mt-1">
      {days.map((d, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ background: "#E11D48" }}>
            {i + 1}
          </div>
          <span className="text-xs text-white/60 truncate">{d}</span>
        </div>
      ))}
    </div>
  );
}

function PlacesMini() {
  const places = [
    { name: "Senso-ji Temple", tag: "Temple" },
    { name: "Shibuya Crossing", tag: "Landmark" },
    { name: "Ramen Ichiran", tag: "Food" },
  ];
  return (
    <div className="space-y-2 mt-1">
      {places.map((p) => (
        <div key={p.name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#E11D48" }} />
            <span className="text-xs text-white/65 truncate">{p.name}</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(225,29,72,0.15)", color: "#FB7185" }}>
            {p.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

export function FeaturesBento() {
  return (
    <section className="py-24 px-4" style={{ background: "#0d0f1a" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(225,29,72,0.12)", border: "1px solid rgba(225,29,72,0.3)", color: "#FB7185" }}
          >
            <Sparkles className="w-3 h-3" />
            All Features
          </div>
          <h2
            className="text-4xl lg:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-sora), sans-serif", letterSpacing: "-0.02em" }}
          >
            Everything for your{" "}
            <span style={{ color: "#E11D48" }}>perfect trip</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Powered by Claude AI — from planning to packing, we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* AI Chat — wide */}
          <FeatureCard
            icon={MessageSquare}
            title="AI Chat Assistant"
            desc="Ask Claude anything about your trip. Get real-time suggestions, local tips, and instant answers."
            className="lg:col-span-2"
            accent
          />

          {/* Smart Alerts */}
          <FeatureCard
            icon={Bell}
            title="Smart Alerts"
            desc="AI monitors your trip and flags things to watch — budget overruns, scheduling conflicts, and more."
          />

          {/* Places */}
          <FeatureCard
            icon={MapPin}
            title="Places Discovery"
            desc="Save places by category. Filter by type, view on map, and never lose a hidden gem."
          >
            <PlacesMini />
          </FeatureCard>

          {/* Itinerary */}
          <FeatureCard
            icon={CalendarDays}
            title="Itinerary Timeline"
            desc="Day-by-day planning with AI suggestions. Generate a full schedule from your saved places."
          >
            <ItineraryMini />
          </FeatureCard>

          {/* Budget */}
          <FeatureCard
            icon={Wallet}
            title="Budget Tracking"
            desc="Multi-currency expense tracking with category breakdowns and smart overspend warnings."
          >
            <BudgetMini />
          </FeatureCard>

          {/* Email Parser */}
          <FeatureCard
            icon={Mail}
            title="Email Booking Parser"
            desc="Paste a booking confirmation email — AI extracts hotels, flights, and restaurants instantly."
          />

          {/* Map View */}
          <FeatureCard
            icon={Map}
            title="Map View"
            desc="See all your saved places on an interactive map. Visualize routes and cluster stops by day."
          />

          {/* Share */}
          <FeatureCard
            icon={Share2}
            title="Share Your Trip"
            desc="Share a beautiful public read-only trip page with friends or family via a unique link."
          />
        </div>
      </div>
    </section>
  );
}
