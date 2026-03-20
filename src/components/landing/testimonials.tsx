import { Star, Sparkles } from "lucide-react";

const REVIEWS = [
  {
    text: "TripMind planned my entire Tokyo trip in under 10 minutes. The AI chat is insanely good — it knew exactly which neighborhoods matched my vibe.",
    name: "Sarah Chen",
    role: "Solo traveler",
    initials: "SC",
    color: "#E11D48",
  },
  {
    text: "The email parser is a game changer. I pasted my Airbnb confirmation and it just worked — added the stay to my itinerary with dates and price.",
    name: "Marcus Johnson",
    role: "Digital nomad",
    initials: "MJ",
    color: "#9333ea",
  },
  {
    text: "Budget tracking across multiple currencies finally makes sense. The smart alerts caught that I was going over on food before I even noticed.",
    name: "Aisha Patel",
    role: "Adventure traveler",
    initials: "AP",
    color: "#0ea5e9",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#E11D48" }} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 px-4" style={{ background: "#0b0d1c" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(225,29,72,0.12)", border: "1px solid rgba(225,29,72,0.3)", color: "#FB7185" }}
          >
            <Sparkles className="w-3 h-3" />
            Reviews
          </div>
          <h2
            className="text-4xl lg:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-sora), sans-serif", letterSpacing: "-0.02em" }}
          >
            Loved by{" "}
            <span style={{ color: "#E11D48" }}>travelers</span>
          </h2>
          <p className="text-white/45 text-lg">Join thousands planning smarter trips with AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="p-6 rounded-2xl flex flex-col gap-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Stars />
              <p className="text-white/65 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: r.color }}
                >
                  {r.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{r.name}</div>
                  <div className="text-xs text-white/35">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
