"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { insforge } from "@/lib/insforge";
import { Package, Clock, ShieldCheck, ArrowRight, Search, Loader2 } from "lucide-react";

interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  created_at: string;
  items?: Array<{
    id: string;
    product_title: string;
    color_name: string;
    size_name: string;
    quantity: number;
    unit_price: number;
  }>;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async (queryUser?: string) => {
    setLoading(true);
    try {
      let q = insforge.database
        .from("orders")
        .select()
        .order("created_at", { ascending: false });

      if (queryUser) {
        q = q.or(`user_id.eq.${queryUser},customer_email.eq.${user?.email}`);
      }

      const { data: ordersData, error: ordersErr } = await q.limit(20);

      if (ordersErr || !ordersData) {
        setOrders([]);
        return;
      }

      // Fetch items for these orders
      const orderIds = ordersData.map((o: { id: string }) => o.id);
      let itemsByOrder: Record<string, any[]> = {};

      if (orderIds.length > 0) {
        const { data: itemsData } = await insforge.database
          .from("order_items")
          .select()
          .in("order_id", orderIds);

        if (itemsData) {
          itemsData.forEach((it: any) => {
            if (!itemsByOrder[it.order_id]) itemsByOrder[it.order_id] = [];
            itemsByOrder[it.order_id].push(it);
          });
        }
      }

      const enriched: OrderRecord[] = ordersData.map((o: any) => ({
        ...o,
        items: itemsByOrder[o.id] || [],
      }));

      setOrders(enriched);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user?.id) {
        fetchOrders(user.id);
      } else {
        fetchOrders();
      }
    }
  }, [user, authLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchOrders(user?.id);
      return;
    }

    setLoading(true);
    try {
      const { data } = await insforge.database
        .from("orders")
        .select()
        .or(`order_number.ilike.%${searchQuery.trim()}%,customer_email.ilike.%${searchQuery.trim()}%`);

      if (data) {
        setOrders(data as OrderRecord[]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="text-center mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8AA6E] block mb-2">
          Atelier Client Archives
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mb-3">
          Order History & Acquisition Status
        </h1>
        <p className="text-xs text-[#888] font-light max-w-md mx-auto">
          Track sartorial shipments, access invoices, and review past wardrobe commissions.
        </p>
      </div>

      {/* Search Order Reference / Lookup Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12 flex">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3.5 text-[#666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order # (e.g. SYR-123456) or Email"
            className="w-full bg-[#121212] border border-[#262626] pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
          />
        </div>
        <button
          type="submit"
          className="bg-white text-black px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#EAEAEA] transition-colors"
        >
          Lookup
        </button>
      </form>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-[#888]">
          <Loader2 size={24} className="animate-spin mr-3 text-white" />
          <span className="text-xs uppercase tracking-[0.2em]">Consulting Atelier Archives...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 p-8 bg-[#111] border border-[#222] max-w-xl mx-auto">
          <Package size={32} className="text-[#555] mx-auto mb-4" />
          <h3 className="text-xs uppercase tracking-[0.2em] text-white font-medium mb-2">
            No Orders On File
          </h3>
          <p className="text-xs text-[#777] mb-6">
            You do not have any recorded orders. Explore our current Autumn/Winter selection.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div key={ord.id} className="p-6 bg-[#111] border border-[#222]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222] gap-2">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-white font-medium">
                      {ord.order_number}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#777]">
                    Placed on {new Date(ord.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#777] block">
                    Total Acquisition
                  </span>
                  <span className="font-mono text-base text-white">
                    ${Number(ord.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {ord.items && ord.items.length > 0 && (
                <div className="py-4 space-y-2">
                  {ord.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between text-xs text-[#AAA]">
                      <span>
                        {it.product_title} ({it.color_name || "Standard"}, Size {it.size_name}) × {it.quantity}
                      </span>
                      <span className="font-mono text-white">
                        ${Number(it.unit_price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-[#1C1C1C] flex justify-between items-center text-[11px] text-[#666]">
                <span className="flex items-center space-x-1.5">
                  <Clock size={12} />
                  <span>Tracked via DHL Express Northern Italy Hub</span>
                </span>
                <span className="text-white hover:underline cursor-pointer">
                  Download Receipt
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

