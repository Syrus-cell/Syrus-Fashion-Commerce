import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E1E]">
      {/* Background Editorial Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="SYRUS Autumn/Winter 2026 Campaign"
          className="w-full h-full object-cover object-[center_30%] filter brightness-[0.4] scale-105 animate-pulse duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-[#0C0C0C]/60" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20 flex flex-col items-center">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.4em] font-medium text-[#C8AA6E] mb-4">
          Autumn / Winter 2026 Collection
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.1em] text-white uppercase leading-[1.1] mb-6">
          The Architectural <br />
          <span className="italic font-normal">Silhouette</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#AFAFAF] max-w-xl font-light leading-relaxed mb-10 tracking-wide">
          Double-faced virgin wool overcoats, unstructured tropical wool blazers, and Grade-A Mongolian cashmere crafted with meticulous European restraint.
        </p>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          <Link
            href="/#catalog"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#EAEAEA] transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/category/outerwear"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/60 text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
          >
            Signature Outerwear
          </Link>
        </div>
      </div>
    </section>
  );
}

