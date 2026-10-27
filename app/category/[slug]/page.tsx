import React from "react";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api";
import { CategoryBar } from "@/components/CategoryBar";
import { ProductCard } from "@/components/ProductCard";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, category] = await Promise.all([
    getCategories(),
    getCategoryBySlug(slug),
  ]);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="min-h-screen">
      {/* Category Hero Banner */}
      <div className="relative py-20 sm:py-28 bg-[#111] border-b border-[#1E1E1E] overflow-hidden">
        {category.image_url && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#C8AA6E] block mb-3">
            Department
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white uppercase tracking-[0.1em] mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-xl mx-auto font-light leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Category Navigation Bar */}
      <CategoryBar categories={categories} activeSlug={slug} />

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#1E1E1E]">
            <span className="text-xs uppercase tracking-[0.2em] text-[#888]">
              {products.length} {products.length === 1 ? "Piece" : "Pieces"} Available
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#888]">
              Refined by: {category.name}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 text-[#888]">
              <p className="text-xs uppercase tracking-[0.2em]">No pieces currently cataloged in this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
