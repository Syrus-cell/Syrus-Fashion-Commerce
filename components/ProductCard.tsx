"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const images = product.images || [];
  const primaryImg = images.find((img) => img.is_primary)?.url || images[0]?.url || "";
  const secondaryImg = images.find((img) => !img.is_primary)?.url || primaryImg;

  const [currentImg, setCurrentImg] = useState(primaryImg);

  // Unique colors from variants
  const colorMap = new Map();
  product.variants?.forEach((v) => {
    if (v.color && !colorMap.has(v.color.id)) {
      colorMap.set(v.color.id, v.color);
    }
  });
  const availableColors = Array.from(colorMap.values());

  return (
    <div className="group flex flex-col">
      {/* Image Container with Luxury Editorial Aspect Ratio */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[3/4] w-full bg-[#141414] overflow-hidden border border-[#1E1E1E] group-hover:border-[#383838] transition-all duration-300"
        onMouseEnter={() => setCurrentImg(secondaryImg)}
        onMouseLeave={() => setCurrentImg(primaryImg)}
      >
        {currentImg ? (
          <img
            src={currentImg}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs tracking-widest text-[#555]">
            SYRUS ATELIER
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5">
          {product.is_featured && (
            <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] font-medium text-white border border-[#333]">
              Curated
            </span>
          )}
          {product.is_new_arrival && (
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] font-medium text-black">
              New Season
            </span>
          )}
        </div>

        {/* Quick View Overlay Bar */}
        <div className="absolute inset-x-0 bottom-0 py-3 bg-black/80 backdrop-blur-md text-center text-[11px] uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Atelier Details
        </div>
      </Link>

      {/* Product Metadata */}
      <div className="mt-4 flex flex-col space-y-1.5">
        {/* Colors & Gender */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#777]">
          <span>{product.gender}</span>
          {availableColors.length > 0 && (
            <div className="flex items-center space-x-1.5">
              {availableColors.map((col) => (
                <span
                  key={col.id}
                  className="w-2.5 h-2.5 rounded-full border border-[#444]"
                  style={{ backgroundColor: col.hex_code }}
                  title={col.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-[#EDEDED] group-hover:text-white transition-colors line-clamp-1"
        >
          {product.title}
        </Link>

        {/* Material / Subtitle Note */}
        {product.material && (
          <p className="text-[11px] text-[#888] truncate italic font-serif">
            {product.material}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline space-x-2 pt-0.5">
          <span className="text-sm font-mono text-white">
            ${Number(product.base_price).toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-xs font-mono text-[#666] line-through">
              ${Number(product.compare_at_price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

