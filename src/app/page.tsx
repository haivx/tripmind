import Link from "next/link";
import { Sparkles, Check, MapPin, Brain, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Clean Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">TripMind</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Get started free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Travel Planner
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Plan Your Perfect Trip with AI in Minutes
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Let our AI assistant create personalized itineraries, suggest places, and manage your travel plans. Solo travelers deserve smart planning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 cursor-pointer w-full sm:w-auto">
                    Start planning free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 cursor-pointer w-full sm:w-auto">
                    See how it works
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">A</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">B</div>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">C</div>
                  </div>
                  <span><strong className="text-gray-900">2,500+</strong> travelers</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="ml-1"><strong className="text-gray-900">4.9</strong> rating</span>
                </div>
              </div>
            </div>

            {/* Right: Product Screenshot/Mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-500 ml-auto">TripMind AI Assistant</span>
                </div>

                {/* Chat Interface */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 flex-1">
                      <p className="text-gray-800 text-sm">I&apos;ve created a 7-day Tokyo itinerary for you! It includes Shibuya, traditional temples, local restaurants, and hidden gems. Ready to explore?</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600 rounded-2xl rounded-tr-none p-4 max-w-xs">
                      <p className="text-white text-sm">Perfect! Can you add budget tracking?</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 flex-1">
                      <p className="text-gray-800 text-sm">Done! I&apos;ve set up budget tracking with category breakdowns. You&apos;re all set! ✨</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">47</div>
                    <div className="text-xs text-gray-600">Places saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to plan your trip</h2>
            <p className="text-xl text-gray-600">Powered by AI, designed for solo travelers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Planning</h3>
              <p className="text-gray-600">Get personalized itineraries based on your preferences, budget, and travel style in seconds.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Discovery</h3>
              <p className="text-gray-600">Find hidden gems, local favorites, and import bookings from emails automatically.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Budget Tracking</h3>
              <p className="text-gray-600">Track expenses across currencies and categories. Stay on budget with intelligent alerts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Start planning in 3 simple steps</h2>
            <p className="text-xl text-gray-600">From idea to itinerary in minutes</p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">1</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your trip</h3>
                <p className="text-gray-600 text-lg">Enter your destination, dates, and preferences. Takes less than a minute.</p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">2</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI creates your itinerary</h3>
                <p className="text-gray-600 text-lg">Our AI analyzes thousands of options and creates a personalized day-by-day plan.</p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">3</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Refine and enjoy</h3>
                <p className="text-gray-600 text-lg">Chat with AI to adjust plans, add places, and track your budget. Everything syncs in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by solo travelers</h2>
            <p className="text-xl text-gray-600">See what our users are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">&quot;TripMind made planning my Tokyo trip so easy! The AI suggested places I never would have found on my own.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">S</div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-sm text-gray-600">Solo traveler</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">&quot;The budget tracking feature is a game-changer. I stayed under budget and had an amazing trip!&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">M</div>
                <div>
                  <div className="font-semibold text-gray-900">Marcus Johnson</div>
                  <div className="text-sm text-gray-600">Digital nomad</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">&quot;Best travel planning app I&apos;ve used. The AI chat is incredibly helpful and feels natural.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">A</div>
                <div>
                  <div className="font-semibold text-gray-900">Aisha Patel</div>
                  <div className="text-sm text-gray-600">Adventure seeker</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to plan your next adventure?</h2>
            <p className="text-xl text-blue-100 mb-8">Join thousands of travelers using AI to plan unforgettable trips</p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 text-lg cursor-pointer">
                Get started free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-blue-200 mt-4">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TripMind</span>
            </div>
            <p className="text-gray-600">
              © 2026 TripMind. AI-powered travel planning for solo adventurers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
