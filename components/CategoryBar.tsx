import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryBarProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryBar({ categories, activeSlug }: CategoryBarProps) {
  return (
    <div className="py-8 border-b border-[#1E1E1E] bg-[#0E0E0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar py-2">
          <Link
            href="/"
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors whitespace-nowrap rounded-none border ${
              !activeSlug
                ? "bg-white text-black border-white"
                : "text-[#888] border-transparent hover:text-white"
            }`}
          >
            All Pieces
          </Link>

          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors whitespace-nowrap rounded-none border ${
                  isActive
                    ? "bg-white text-black border-white"
                    : "text-[#888] border-transparent hover:text-white"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

