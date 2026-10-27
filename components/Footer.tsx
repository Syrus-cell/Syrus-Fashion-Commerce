import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1C1C1C] text-[#999] pt-16 pb-12">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#1C1C1C]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-3.5">
            <Sparkles className="text-white mt-1 flex-shrink-0" size={18} />
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white mb-1">
                Noble Materials
              </h4>
              <p className="text-xs text-[#777] leading-relaxed">
                Grade-A Mongolian cashmere, Tuscan Vachetta, and double-faced virgin wool.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <ShieldCheck className="text-white mt-1 flex-shrink-0" size={18} />
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white mb-1">
                Artisanal Provenance
              </h4>
              <p className="text-xs text-[#777] leading-relaxed">
                Handcrafted by master cobblers and tailors in Civitanova Marche and Biella, Italy.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <Truck className="text-white mt-1 flex-shrink-0" size={18} />
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white mb-1">
                Global Express
              </h4>
              <p className="text-xs text-[#777] leading-relaxed">
                Complimentary tracked DHL Express on orders exceeding $500 worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <RefreshCw className="text-white mt-1 flex-shrink-0" size={18} />
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white mb-1">
                Complimentary Returns
              </h4>
              <p className="text-xs text-[#777] leading-relaxed">
                30-day effortless return and exchange privilege on all unworn items.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <span className="font-serif text-2xl font-light tracking-[0.35em] text-white block">
            SYRUS
          </span>
          <p className="text-xs text-[#777] leading-relaxed max-w-sm">
            Architectural tailoring, deconstructed outerwear, and artisanal Italian leather goods designed for a timeless, modern silhouette.
          </p>
          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#AAA] mb-2 font-medium">
              Join The Private Circle
            </p>
            <div className="flex max-w-sm">
              <input
                type="email"
                placeholder="Enter client email"
                className="bg-[#141414] border border-[#262626] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white flex-1"
              />
              <button
                className="bg-white text-black px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#EAEAEA] transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-medium">
            Collections
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/category/outerwear" className="hover:text-white transition-colors">Outerwear & Coats</Link></li>
            <li><Link href="/category/tailoring" className="hover:text-white transition-colors">Tailoring & Blazers</Link></li>
            <li><Link href="/category/knitwear-tops" className="hover:text-white transition-colors">Pure Cashmere & Tops</Link></li>
            <li><Link href="/category/footwear" className="hover:text-white transition-colors">Handmade Footwear</Link></li>
            <li><Link href="/category/accessories" className="hover:text-white transition-colors">Leather Goods & Accessories</Link></li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="space-y-3">
          <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-medium">
            Client Services
          </h5>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">Private Atelier Appointments</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Sartorial Alterations</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Worldwide Delivery</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Returns & Exchanges</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Garment & Leather Care</span></li>
          </ul>
        </div>

        {/* Maison */}
        <div className="space-y-3">
          <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-medium">
            The Maison
          </h5>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">Our Manifesto</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Italian Mills & Tanneries</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Sustainability & Traceability</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Stockists & Flagships</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#666]">
        <p>© 2026 SYRUS MAISON. All Rights Reserved. Powered by InsForge Cloud Platform.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span className="hover:text-[#AAA] cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#AAA] cursor-pointer">Terms of Service</span>
          <span className="hover:text-[#AAA] cursor-pointer">Cookie Preferences</span>
        </div>
      </div>
    </footer>
  );
}

