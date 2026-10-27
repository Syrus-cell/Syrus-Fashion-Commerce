"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { insforge } from "@/lib/insforge";
import { useAuth } from "./AuthContext";
import { Product, Color, Size } from "@/lib/types";

export interface EnrichedCartItem {
  id: string;
  variant_id: string;
  quantity: number;
  product_id: string;
  title: string;
  slug: string;
  price: number;
  image_url: string;
  color_name: string;
  color_hex: string;
  size_name: string;
  sku: string;
  stock_quantity: number;
}

interface CartContextType {
  items: EnrichedCartItem[];
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (variantId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalCount: number;
  subtotal: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<EnrichedCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Determine current user identifier (Auth ID or persistent guest session)
  useEffect(() => {
    if (typeof window !== "undefined") {
      let guestId = localStorage.getItem("syrus_guest_id");
      if (!guestId) {
        guestId = "guest_" + Math.random().toString(36).substring(2, 12);
        localStorage.setItem("syrus_guest_id", guestId);
      }
      setSessionId(guestId);
    }
  }, []);

  const activeUserId = user?.id || sessionId;

  const refreshCart = useCallback(async () => {
    if (!activeUserId) return;
    setLoading(true);
    try {
      // 1. Get raw cart items for this user
      const { data: cartData, error: cartError } = await insforge.database
        .from("cart_items")
        .select()
        .eq("user_id", activeUserId);

      if (cartError || !cartData || cartData.length === 0) {
        setItems([]);
        return;
      }

      // 2. Fetch variants for these cart items
      const variantIds = cartData.map((c: { variant_id: string }) => c.variant_id);
      const { data: variantsData } = await insforge.database
        .from("product_variants")
        .select()
        .in("id", variantIds);

      if (!variantsData) {
        setItems([]);
        return;
      }

      // 3. Fetch products, colors, sizes, and images
      const productIds = Array.from(new Set(variantsData.map((v: { product_id: string }) => v.product_id)));
      const colorIds = Array.from(new Set(variantsData.map((v: { color_id: string }) => v.color_id).filter(Boolean)));
      const sizeIds = Array.from(new Set(variantsData.map((v: { size_id: string }) => v.size_id).filter(Boolean)));

      const [productsRes, colorsRes, sizesRes, imagesRes] = await Promise.all([
        insforge.database.from("products").select().in("id", productIds),
        colorIds.length ? insforge.database.from("colors").select().in("id", colorIds) : { data: [] },
        sizeIds.length ? insforge.database.from("sizes").select().in("id", sizeIds) : { data: [] },
        insforge.database.from("product_images").select().in("product_id", productIds),
      ]);

      const productsMap = new Map<string, Product>((productsRes.data || []).map((p: any) => [p.id, p as Product]));
      const colorsMap = new Map<string, Color>((colorsRes.data || []).map((c: any) => [c.id, c as Color]));
      const sizesMap = new Map<string, Size>((sizesRes.data || []).map((s: any) => [s.id, s as Size]));
      const imagesMap = new Map<string, string>();

      (imagesRes.data || []).forEach((img: { product_id: string; is_primary: boolean; url: string }) => {
        if (!imagesMap.has(img.product_id) || img.is_primary) {
          imagesMap.set(img.product_id, img.url);
        }
      });

      // 4. Combine into EnrichedCartItem
      const enriched: EnrichedCartItem[] = cartData.map((c: { id: string; variant_id: string; quantity: number }) => {
        const variant = variantsData.find((v: { id: string }) => v.id === c.variant_id);
        const product = variant ? productsMap.get(variant.product_id) : null;
        const color = variant?.color_id ? colorsMap.get(variant.color_id) : null;
        const size = variant?.size_id ? sizesMap.get(variant.size_id) : null;

        return {
          id: c.id,
          variant_id: c.variant_id,
          quantity: c.quantity,
          product_id: product?.id || "",
          title: product?.title || "Item",
          slug: product?.slug || "",
          price: variant?.price_override ?? (product?.base_price || 0),
          image_url: imagesMap.get(product?.id || "") || "",
          color_name: color?.name || "Standard",
          color_hex: color?.hex_code || "#000",
          size_name: size?.name || "One Size",
          sku: variant?.sku || "",
          stock_quantity: variant?.stock_quantity ?? 10,
        };
      });

      setItems(enriched);
    } catch (e) {
      console.error("Cart error:", e);
    } finally {
      setLoading(false);
    }
  }, [activeUserId]);

  useEffect(() => {
    if (activeUserId) {
      refreshCart();
    }
  }, [activeUserId, refreshCart]);

  const addToCart = async (variantId: string, quantity = 1) => {
    if (!activeUserId) return { success: false, error: "No session available" };

    try {
      const existing = items.find((i) => i.variant_id === variantId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const { error } = await insforge.database
          .from("cart_items")
          .update({ quantity: newQty, updated_at: new Date().toISOString() })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await insforge.database
          .from("cart_items")
          .insert([
            {
              user_id: activeUserId,
              variant_id: variantId,
              quantity,
            },
          ]);

        if (error) throw error;
      }

      await refreshCart();
      setIsOpen(true);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add to cart";
      return { success: false, error: message };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await insforge.database
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", itemId);

      await refreshCart();
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await insforge.database.from("cart_items").delete().eq("id", itemId);
      await refreshCart();
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = async () => {
    if (!activeUserId) return;
    try {
      await insforge.database.from("cart_items").delete().eq("user_id", activeUserId);
      setItems([]);
    } catch (e) {
      console.error(e);
    }
  };

  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        isOpen,
        setIsOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
