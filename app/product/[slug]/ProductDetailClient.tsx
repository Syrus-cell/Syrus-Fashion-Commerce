"use client";

import React, { useState } from "react";
import { Product, ProductVariant, Color, Size, Review } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { insforge } from "@/lib/insforge";
import { Check, Star, ShieldCheck, Truck, RotateCcw, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  initialReviews: Review[];
}

export function ProductDetailClient({ product, initialReviews }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const variants = product.variants || [];
  const images = product.images || [];

  // Deduplicate available colors and sizes
  const colorsMap = new Map<string, Color>();
  const sizesMap = new Map<string, Size>();

  variants.forEach((v) => {
    if (v.color && !colorsMap.has(v.color.id)) colorsMap.set(v.color.id, v.color);
    if (v.size && !sizesMap.has(v.size.id)) sizesMap.set(v.size.id, v.size);
  });

  const availableColors = Array.from(colorsMap.values());
  const availableSizes = Array.from(sizesMap.values());

  // Default selections
  const [selectedColor, setSelectedColor] = useState<Color | null>(availableColors[0] || null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(availableSizes[0] || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find active variant based on selected color and size
  const activeVariant: ProductVariant | undefined = variants.find((v) => {
    const matchColor = !selectedColor || v.color_id === selectedColor.id;
    const matchSize = !selectedSize || v.size_id === selectedSize.id;
    return matchColor && matchSize;
  }) || variants[0];

  const stock = activeVariant?.stock_quantity ?? 0;
  const isOutOfStock = stock <= 0;

  // Add to cart state
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Accordion tabs
  const [openSection, setOpenSection] = useState<"details" | "composition" | "fit" | "care" | "shipping">("details");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!activeVariant || isOutOfStock) return;
    setAdding(true);
    setAddSuccess(false);

    const res = await addToCart(activeVariant.id, 1);
    setAdding(false);

    if (res.success) {
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2500);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const newReview = {
        product_id: product.id,
        user_id: user?.id || "guest_" + Math.random().toString(36).substring(2, 8),
        user_name: reviewName.trim() || user?.email?.split("@")[0] || "Verified Client",
        rating,
        title: reviewTitle.trim() || null,
        comment: reviewComment.trim(),
        is_verified: true,
      };

      const { data, error } = await insforge.database
        .from("reviews")
        .insert([newReview])
        .select();

      if (!error && data && data.length > 0) {
        setReviews([data[0] as Review, ...reviews]);
        setReviewSuccess(true);
        setReviewTitle("");
        setReviewComment("");
        setReviewName("");
      }
    } catch (e) {
      console.error("Failed to submit review:", e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Image Gallery (Editorial Split Layout) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[3/4] w-16 md:w-full overflow-hidden border transition-all ${
                    activeImageIndex === idx ? "border-white" : "border-[#262626] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={img.alt_text || product.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Display Shot */}
          <div className="flex-1 relative aspect-[3/4] bg-[#141414] border border-[#222] overflow-hidden">
            {images[activeImageIndex] ? (
              <img
                src={images[activeImageIndex].url}
                alt={images[activeImageIndex].alt_text || product.title}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs tracking-widest text-[#555]">
                SYRUS MAISON
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.is_featured && (
                <span className="px-3 py-1 bg-black/85 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-medium text-white border border-[#333]">
                  Permanent Collection
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Specifications, Variants & Action */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-8">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#888] mb-2">
              <span>{product.category?.name || "Atelier"}</span>
              <span className="capitalize">{product.gender}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-wide leading-snug">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-xs text-[#888] font-light mt-1.5 uppercase tracking-wider">
                {product.subtitle}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline space-x-3 mt-4">
              <span className="font-mono text-xl text-white">
                ${Number(product.base_price).toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="font-mono text-sm text-[#666] line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
              <span className="text-[11px] text-[#888] tracking-wider uppercase ml-2">
                Duties Included
              </span>
            </div>
          </div>

          <div className="border-t border-[#1E1E1E] pt-6 space-y-6">
            {/* 1. COLOR SELECTION */}
            {availableColors.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs uppercase tracking-[0.18em] mb-3">
                  <span className="text-[#888]">Color:</span>
                  <span className="text-white font-medium">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {availableColors.map((col) => {
                    const isSelected = selectedColor?.id === col.id;
                    return (
                      <button
                        key={col.id}
                        onClick={() => setSelectedColor(col)}
                        className={`group relative p-1 rounded-full transition-all ${
                          isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#0C0C0C]" : "opacity-75 hover:opacity-100"
                        }`}
                        title={col.name}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-[#444]"
                          style={{ backgroundColor: col.hex_code }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. SIZE SELECTION */}
            {availableSizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs uppercase tracking-[0.18em] mb-3">
                  <span className="text-[#888]">Select Size:</span>
                  <span className="text-[#888] underline hover:text-white cursor-pointer text-[10px]">
                    Size Chart
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSize?.id === sz.id;
                    return (
                      <button
                        key={sz.id}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 text-xs uppercase font-mono tracking-wider transition-all border ${
                          isSelected
                            ? "bg-white text-black border-white font-semibold"
                            : "bg-[#141414] text-[#CCC] border-[#292929] hover:border-[#555]"
                        }`}
                      >
                        {sz.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. INVENTORY & SKU STATUS */}
            <div className="flex justify-between items-center text-[11px] font-mono text-[#888] pt-1">
              <div>
                {isOutOfStock ? (
                  <span className="text-red-400">Sold Out In Atelier</span>
                ) : stock < 8 ? (
                  <span className="text-amber-400">Limited Quantity: {stock} remaining</span>
                ) : (
                  <span className="text-emerald-400">In Stock for Immediate Dispatch</span>
                )}
              </div>
              <div>SKU: {activeVariant?.sku || "SYR-ATELIER"}</div>
            </div>

            {/* 4. ADD TO CART CTA BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className="w-full py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#EAEAEA] transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
              >
                {adding ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : addSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Added To Private Bag</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Currently Unavailable</span>
                ) : (
                  <span>Add To Shopping Bag</span>
                )}
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1E1E1E] text-center text-[10px] uppercase tracking-wider text-[#888]">
            <div className="flex flex-col items-center space-y-1.5">
              <Truck size={16} className="text-white" />
              <span>Complimentary Express</span>
            </div>
            <div className="flex flex-col items-center space-y-1.5">
              <ShieldCheck size={16} className="text-white" />
              <span>Guaranteed Authenticity</span>
            </div>
            <div className="flex flex-col items-center space-y-1.5">
              <RotateCcw size={16} className="text-white" />
              <span>30-Day Returns</span>
            </div>
          </div>

          {/* Accordion Panels */}
          <div className="border-t border-[#1E1E1E] divide-y divide-[#1E1E1E]">
            {/* Description & Narrative */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === "details" ? "composition" : "details")}
                className="w-full py-4 flex justify-between items-center text-xs uppercase tracking-[0.2em] font-medium text-white hover:text-[#CCC]"
              >
                <span>Atelier Narrative & Details</span>
                {openSection === "details" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "details" && (
                <div className="pb-5 text-xs text-[#999] leading-relaxed font-light">
                  {product.description || "Crafted to exacting sartorial standards."}
                </div>
              )}
            </div>

            {/* Materials & Composition */}
            {product.material && (
              <div>
                <button
                  onClick={() => setOpenSection(openSection === "composition" ? "details" : "composition")}
                  className="w-full py-4 flex justify-between items-center text-xs uppercase tracking-[0.2em] font-medium text-white hover:text-[#CCC]"
                >
                  <span>Composition & Raw Noble Fibers</span>
                  {openSection === "composition" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSection === "composition" && (
                  <div className="pb-5 text-xs text-[#999] leading-relaxed font-light space-y-2">
                    <p>{product.material}</p>
                    <p className="text-[11px] text-[#777]">Sourced from certified European mills committed to ethical pastoral standards.</p>
                  </div>
                )}
              </div>
            )}

            {/* Fit & Measurements */}
            {product.fit && (
              <div>
                <button
                  onClick={() => setOpenSection(openSection === "fit" ? "details" : "fit")}
                  className="w-full py-4 flex justify-between items-center text-xs uppercase tracking-[0.2em] font-medium text-white hover:text-[#CCC]"
                >
                  <span>Sartorial Fit & Silhouette</span>
                  {openSection === "fit" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSection === "fit" && (
                  <div className="pb-5 text-xs text-[#999] leading-relaxed font-light">
                    {product.fit}
                  </div>
                )}
              </div>
            )}

            {/* Care & Maintenance */}
            {product.care && (
              <div>
                <button
                  onClick={() => setOpenSection(openSection === "care" ? "details" : "care")}
                  className="w-full py-4 flex justify-between items-center text-xs uppercase tracking-[0.2em] font-medium text-white hover:text-[#CCC]"
                >
                  <span>Care & Longevity Guide</span>
                  {openSection === "care" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSection === "care" && (
                  <div className="pb-5 text-xs text-[#999] leading-relaxed font-light">
                    {product.care}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews & Client Impressions Section */}
      <section className="mt-24 pt-16 border-t border-[#1E1E1E]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8AA6E] block mb-2">
              Client Impressions
            </span>
            <h2 className="font-serif text-3xl font-light text-white">
              Atelier Reviews ({reviews.length})
            </h2>
          </div>

          {/* List of existing reviews */}
          <div className="space-y-6 mb-16">
            {reviews.length === 0 ? (
              <p className="text-center text-xs text-[#777] italic py-8">
                No reviews yet for this masterpiece. Be the first to record an impression.
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-[#121212] border border-[#222]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-medium text-white">{rev.user_name}</span>
                      {rev.is_verified && (
                        <span className="ml-2 text-[10px] text-emerald-400 font-mono tracking-wider">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < rev.rating ? "currentColor" : "none"}
                          className={i < rev.rating ? "text-amber-400" : "text-[#444]"}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.title && (
                    <h4 className="text-xs font-semibold text-[#DDD] mb-1.5">{rev.title}</h4>
                  )}
                  <p className="text-xs text-[#999] leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Leave a review form */}
          <div className="p-8 bg-[#111] border border-[#242424]">
            <h3 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-6">
              Share Your Atelier Impression
            </h3>

            {reviewSuccess && (
              <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs">
                Your impression has been published to the SYRUS archives. Thank you.
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                    Your Name / Client Title
                  </label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Julian K."
                    className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                    Rating (Stars)
                  </label>
                  <div className="flex items-center space-x-2 py-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star size={18} fill={s <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-white ml-2">{rating}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  Impression Title
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Flawless drape and weight"
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  Review & Sartorial Assessment *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the silhouette, fabric handfeel, and fit..."
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#EAEAEA] transition-colors disabled:opacity-50"
              >
                {submittingReview ? "Archiving..." : "Publish Review"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

