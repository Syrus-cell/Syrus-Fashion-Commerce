import React from "react";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { HeroSection } from "@/components/HeroSection";
import { CategoryBar } from "@/components/CategoryBar";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Compass } from "lucide-react";

export default async function HomePage() {
  const [categories, allProducts, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts({ limit: 12 }),
    getProducts({ isFeatured: true, limit: 4 }),
  ]);

  return (
    <div className="min-h-screen">
      {/* 1. Hero Editorial Section */}
      <HeroSection />

      {/* 2. Category Navigation */}
      <CategoryBar categories={categories} />

      {/* 3. Featured Atelier Selection */}
      {featuredProducts.length > 0 && (
        <section className="py-20 border-b border-[#1E1E1E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#C8AA6E] block mb-2">
                  Permanent Collection
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.05em] text-white">
                  Curated Essentials
                </h2>
              </div>
              <p className="text-xs text-[#888] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
                Fundamental garments defined by uncompromising silhouette precision, tactile depth, and lifetime construction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Atelier Craftsmanship Editorial Spotlight */}
      <section className="py-24 border-b border-[#1E1E1E] bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative">
              <div className="aspect-[16/10] bg-[#1A1A1A] overflow-hidden border border-[#242424]">
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1400&auto=format&fit=crop"
                  alt="Italian Mill Craftsmanship"
                  className="w-full h-full object-cover filter brightness-90"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 bg-[#141414] border border-[#2E2E2E] shadow-2xl max-w-xs">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8AA6E] block mb-1">
                  Atelier Provenance
                </span>
                <p className="text-xs text-[#BBB] font-serif leading-relaxed">
                  "In every seam, the dialogue between heritage Italian weaving and reductive modernist lines."
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#C8AA6E] block">
                The Fabric Manifesto
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
                Noble Fibers. <br />
                Pure Intention.
              </h3>
              <p className="text-xs sm:text-sm text-[#888] font-light leading-relaxed">
                We reject seasonal disposability in favor of archival permanence. Every meter of our double-faced virgin wool, 7-gauge Mongolian cashmere, and French boxcalf is sourced directly from heritage family-run tanneries and mills.
              </p>
              <div className="pt-4">
                <Link
                  href="/category/tailoring"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-white hover:text-[#C8AA6E] transition-colors group"
                >
                  <span>Explore Tailoring & Fabrication</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Complete Catalog Grid */}
      <section id="catalog" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#888] block mb-2">
                Full Catalog
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.05em] text-white">
                The Complete Silhouette
              </h2>
            </div>
            <p className="text-xs text-[#888] font-mono mt-2 md:mt-0">
              Showing {allProducts.length} Atelier Masterpieces
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
