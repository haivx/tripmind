import { MessageSquare, CalendarDays, Mail, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

const SURFACE: React.CSSProperties = {
  background: "#13162a",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
};

function ChatPreview() {
  return (
    <div style={{ ...SURFACE, padding: "20px" }}>
      <div className="space-y-3">
        {[
          { ai: true, text: "What do you want to do in Tokyo?" },
          { ai: false, text: "Street food tour + anime spots!" },
          { ai: true, text: "Perfect! I'll add Akihabara, Harajuku takoyaki stalls, and Tsukiji market to Day 2." },
          { ai: false, text: "Can you fit it all in one day?" },
          { ai: true, text: "Yes — 4 stops, ~8 mins apart by train. Want me to add transport times?" },
        ].map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.ai ? "" : "justify-end"}`}>
            {m.ai && (
              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "#E11D48" }}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className="text-xs rounded-xl px-3 py-2 max-w-[75%] leading-relaxed"
              style={m.ai
                ? { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)" }
                : { background: "#E11D48", color: "white" }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {["Best ramen spots?", "Add Ghibli Museum", "Check my budget"].map((q) => (
          <span key={q} className="text-xs px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(225,29,72,0.12)", border: "1px solid rgba(225,29,72,0.25)", color: "#FB7185" }}>
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}

function ItineraryPreview() {
  const days = [
    { day: "Day 1", label: "Arrival & Shinjuku", items: ["Check-in Shinjuku hotel", "Golden Gai bar crawl"] },
    { day: "Day 2", label: "Temples & Culture", items: ["Senso-ji Temple 9am", "Ueno Park & Museums"] },
    { day: "Day 3", label: "Pop Culture Day", items: ["Akihabara electronics", "Harajuku street style"] },
  ];
  return (
    <div style={{ ...SURFACE, padding: "20px" }} className="space-y-3">
      {days.map((d) => (
        <div key={d.day} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#E11D48" }}>
              {d.day.split(" ")[1]}
            </div>
            <div className="flex-1 w-px mt-1" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>
          <div className="pb-3">
            <div className="text-sm font-semibold text-white mb-1">{d.label}</div>
            {d.items.map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-white/45">
                <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: "#E11D48" }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer" style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.2)" }}>
        <Sparkles className="w-3.5 h-3.5" style={{ color: "#E11D48" }} />
        <span className="text-xs" style={{ color: "#FB7185" }}>Generate 4 more days with AI</span>
        <ArrowRight className="w-3 h-3 ml-auto" style={{ color: "#FB7185" }} />
      </div>
    </div>
  );
}

function EmailPreview() {
  return (
    <div className="space-y-3">
      <div style={{ ...SURFACE, padding: "16px" }}>
        <div className="text-xs text-white/30 mb-2">Booking confirmation email</div>
        <div className="text-xs text-white/55 leading-relaxed font-mono">
          From: bookings@airbnb.com<br />
          Subject: Reservation confirmed · Tokyo<br />
          Check-in: Mar 15 · Check-out: Mar 22<br />
          Shinjuku Apartment · ¥84,000
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-white/30">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <Sparkles className="w-3.5 h-3.5" style={{ color: "#E11D48" }} />
        <span>AI extracted</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div style={{ ...SURFACE, padding: "16px", border: "1px solid rgba(225,29,72,0.2)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(225,29,72,0.15)" }}>
            <CheckCircle className="w-4 h-4" style={{ color: "#E11D48" }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Shinjuku Apartment</div>
            <div className="text-xs text-white/40">Airbnb · Accommodation</div>
          </div>
          <div className="ml-auto text-sm font-bold" style={{ color: "#FB7185" }}>¥84,000</div>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }}>Mar 15 – 22</span>
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(225,29,72,0.1)", color: "#FB7185" }}>Hotel</span>
        </div>
      </div>
    </div>
  );
}

interface ShowcaseItem {
  icon: React.ElementType;
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
  preview: React.ReactNode;
  flip?: boolean;
}

const ITEMS: ShowcaseItem[] = [
  {
    icon: MessageSquare,
    badge: "AI Chat",
    title: "Your AI travel expert, always on",
    desc: "Chat naturally with Claude about anything trip-related. Get hyper-local suggestions, ask follow-up questions, and let AI refine your plans in real time.",
    bullets: ["Streaming responses — no waiting", "Context-aware across your full trip", "Suggested questions to get started"],
    preview: <ChatPreview />,
  },
  {
    icon: CalendarDays,
    badge: "Itinerary AI",
    title: "Full itinerary in one click",
    desc: "Tell the AI your saved places and trip dates — it builds a logical day-by-day schedule with travel times, opening hours, and local tips baked in.",
    bullets: ["Day-by-day structure with timeline", "Preview before applying to your trip", "Editable after generation"],
    preview: <ItineraryPreview />,
    flip: true,
  },
  {
    icon: Mail,
    badge: "Email Parser",
    title: "Import bookings from emails",
    desc: "Paste any booking confirmation email — flights, hotels, restaurants, tours — and the AI extracts every detail and adds it directly to your places list.",
    bullets: ["Supports Airbnb, Booking.com, airlines", "Auto-detects category & price", "One-click save to your trip"],
    preview: <EmailPreview />,
  },
];

export function AIShowcase() {
  return (
    <section className="py-24 px-4" style={{ background: "#0b0d1c" }}>
      <div className="max-w-6xl mx-auto space-y-28">
        {ITEMS.map((item) => (
          <div
            key={item.badge}
            className={`grid lg:grid-cols-2 gap-12 items-center ${item.flip ? "lg:[&>*:first-child]:order-last" : ""}`}
          >
            {/* Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background: "rgba(225,29,72,0.13)", border: "1px solid rgba(225,29,72,0.32)", color: "#FB7185" }}
              >
                <item.icon className="w-3 h-3" />
                {item.badge}
              </div>
              <h3
                className="text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-sora), sans-serif", letterSpacing: "-0.02em" }}
              >
                {item.title}
              </h3>
              <p className="text-white/50 text-base leading-relaxed mb-8">{item.desc}</p>
              <ul className="space-y-3">
                {item.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-white/65">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#E11D48" }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview */}
            <div>{item.preview}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
