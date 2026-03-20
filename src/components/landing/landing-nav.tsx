"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div
        className="max-w-7xl mx-auto rounded-2xl px-6 py-3.5 flex items-center justify-between"
        style={{
          background: "rgba(13,15,26,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#E11D48", boxShadow: "0 0 20px rgba(225,29,72,0.45)" }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            TripMind
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors duration-200 text-sm"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              className="text-white text-sm px-5 h-9 cursor-pointer transition-all duration-200 hover:-translate-y-px flex items-center justify-center leading-none"
              style={{
                background: "#E11D48",
                boxShadow: "0 0 16px rgba(225,29,72,0.35)",
                borderRadius: "10px",
              }}
            >
              Start free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
