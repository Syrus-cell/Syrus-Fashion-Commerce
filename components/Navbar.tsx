"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User as UserIcon, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { totalCount, setIsOpen: setCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0C0C0C]/90 backdrop-blur-md border-b border-[#1E1E1E]">
        {/* Top Announcement Bar */}
        <div className="bg-[#141414] text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] text-center py-2 px-4 border-b border-[#222]">
          Complimentary Worldwide Express Delivery on orders over $500 • Autumn/Winter 2026
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#E0E0E0] hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[12px] uppercase tracking-[0.18em] font-medium text-[#B0B0B0]">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Collection
            </Link>
            <Link href="/category/outerwear" className="hover:text-white transition-colors duration-200">
              Outerwear
            </Link>
            <Link href="/category/tailoring" className="hover:text-white transition-colors duration-200">
              Tailoring
            </Link>
            <Link href="/category/knitwear-tops" className="hover:text-white transition-colors duration-200">
              Knitwear
            </Link>
            <Link href="/category/footwear" className="hover:text-white transition-colors duration-200">
              Footwear
            </Link>
            <Link href="/category/accessories" className="hover:text-white transition-colors duration-200">
              Accessories
            </Link>
          </nav>

          {/* Center Brand Logo */}
          <div className="flex-1 md:flex-initial text-center">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.35em] text-[#FAFAFA] hover:opacity-85 transition-opacity">
                SYRUS
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-6 text-[#D0D0D0]">
            {/* User Account / Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-[12px] tracking-wider uppercase text-[#E0E0E0] hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#242424] border border-[#333] flex items-center justify-center text-xs font-medium text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-xs truncate max-w-[120px]">
                    {user.email.split("@")[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#161616] border border-[#2A2A2A] rounded-sm shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#252525]">
                      <p className="text-[11px] uppercase tracking-wider text-[#888]">Signed in as</p>
                      <p className="text-xs font-medium text-white truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-[#CCC] hover:text-white hover:bg-[#202020]"
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#202020] flex items-center space-x-2"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center space-x-2 text-xs uppercase tracking-[0.15em] text-[#C0C0C0] hover:text-white transition-colors"
                title="Account"
              >
                <UserIcon size={19} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1 text-[#E0E0E0] hover:text-white transition-colors"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag size={21} />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-white text-black font-semibold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#101010] border-b border-[#242424] px-6 py-6 space-y-4 text-xs uppercase tracking-[0.2em] text-[#CCC]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-white"
            >
              All Collection
            </Link>
            <Link
              href="/category/outerwear"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-white"
            >
              Outerwear
            </Link>
            <Link
              href="/category/tailoring"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-white"
            >
              Tailoring
            </Link>
            <Link
              href="/category/knitwear-tops"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-white"
            >
              Knitwear & Tops
            </Link>
            <Link
              href="/category/footwear"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-white"
            >
              Footwear
            </Link>
            <Link
              href="/category/accessories"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-white"
            >
              Leather Goods & Accessories
            </Link>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

