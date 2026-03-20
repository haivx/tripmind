import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <>
      {/* CTA */}
      <section className="py-24 px-4" style={{ background: "#0d0f1a" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="relative rounded-3xl p-12 overflow-hidden"
            style={{
              background: "#13162a",
              border: "1px solid rgba(225,29,72,0.25)",
              boxShadow: "0 0 80px rgba(225,29,72,0.1)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.15) 0%, transparent 60%)" }}
            />
            <div className="relative">
              <div
                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background: "rgba(225,29,72,0.15)", border: "1px solid rgba(225,29,72,0.4)", color: "#FB7185" }}
              >
                <Sparkles className="w-3 h-3" />
                Free Forever
              </div>
              <h2
                className="text-4xl lg:text-5xl font-extrabold text-white mb-5"
                style={{ fontFamily: "var(--font-sora), sans-serif", letterSpacing: "-0.025em" }}
              >
                Start your next adventure
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
                Join 2,500+ travelers who plan smarter trips with TripMind&apos;s AI assistant.
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-white text-base px-10 h-14 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "#E11D48",
                    boxShadow: "0 0 40px rgba(225,29,72,0.5)",
                    borderRadius: "12px",
                    fontFamily: "var(--font-sora), sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Get started free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-white/25 mt-5">No credit card required · Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4" style={{ background: "#0d0f1a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#E11D48" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              TripMind
            </span>
          </div>
          <p className="text-sm text-white/30 text-center">
            © 2026 TripMind · AI-powered travel planning for solo adventurers
          </p>
          <div className="flex items-center gap-4 text-sm text-white/30">
            <Link href="/login" className="hover:text-white/60 transition-colors duration-200 cursor-pointer">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-white/60 transition-colors duration-200 cursor-pointer">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
