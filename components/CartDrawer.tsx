"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, subtotal, totalCount } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diffToFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101010] border-l border-[#222] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#222] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xs uppercase tracking-[0.25em] font-medium text-white">
                Shopping Bag
              </h2>
              <span className="text-[11px] text-[#777] font-mono">({totalCount})</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#888] hover:text-white transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Complimentary Shipping Banner */}
          <div className="px-6 py-4 bg-[#141414] border-b border-[#222]">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#999] mb-2">
              <span>
                {diffToFree === 0
                  ? "✓ Complimentary Express Shipping Unlocked"
                  : `Add $${diffToFree.toFixed(2)} for Free Worldwide Express`}
              </span>
              <span className="font-mono text-white">{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-[#242424] rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full border border-[#262626] flex items-center justify-center text-[#555] mb-4">
                  <X size={24} />
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#CCC] mb-2">
                  Your Bag Is Empty
                </h3>
                <p className="text-xs text-[#777] max-w-[240px] mb-6">
                  Explore our modern tailoring, Italian footwear, and artisanal outerwear.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#EAEAEA]"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-4 border-b border-[#1E1E1E] pb-6">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-28 bg-[#1A1A1A] flex-shrink-0 overflow-hidden border border-[#262626]">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#555]">
                        SYRUS
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-medium text-white hover:underline pr-2 line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs font-medium text-white font-mono">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Variant Specs */}
                      <div className="mt-1 flex items-center space-x-3 text-[11px] text-[#888]">
                        <span className="flex items-center space-x-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-[#444]"
                            style={{ backgroundColor: item.color_hex }}
                          />
                          <span>{item.color_name}</span>
                        </span>
                        <span>•</span>
                        <span>Size {item.size_name}</span>
                      </div>

                      <div className="text-[10px] text-[#666] font-mono mt-0.5">
                        SKU: {item.sku}
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center border border-[#2B2B2B] bg-[#161616]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-[#888] hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-xs font-mono text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-[#888] hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#666] hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#222] bg-[#141414] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-white">
                    {diffToFree === 0 ? "Complimentary" : "$35.00"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Estimated Duties & Taxes</span>
                  <span className="font-mono text-white">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#262626] flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-white">
                  Estimated Total
                </span>
                <span className="font-serif text-lg font-normal text-white font-mono">
                  ${(subtotal + (diffToFree === 0 ? 0 : 35)).toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#EAEAEA] transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>

              <div className="flex items-center justify-center space-x-2 text-[10px] uppercase tracking-wider text-[#666] pt-1">
                <ShieldCheck size={12} />
                <span>Encrypted 256-Bit Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

