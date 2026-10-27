"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { insforge } from "@/lib/insforge";
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.profile?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.profile?.name?.split(" ")[1] || "");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");

  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const shippingCost = subtotal >= 500 ? 0 : 35;
  const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = subtotal + shippingCost + taxAmount;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setProcessing(true);
    setErrorMsg(null);

    try {
      const orderNumber = "SYR-" + Math.floor(100000 + Math.random() * 900000);

      // 1. Insert Order
      const { data: orderData, error: orderErr } = await insforge.database
        .from("orders")
        .insert([
          {
            order_number: orderNumber,
            user_id: user?.id || null,
            customer_email: email,
            customer_name: `${firstName} ${lastName}`.trim(),
            status: "processing",
            subtotal,
            shipping_cost: shippingCost,
            tax_amount: taxAmount,
            total_amount: totalAmount,
            shipping_address: {
              address,
              apartment,
              city,
              country,
              postalCode,
              phone,
            },
            payment_status: "paid",
            payment_method: "card",
          },
        ])
        .select();

      if (orderErr || !orderData || orderData.length === 0) {
        throw new Error(orderErr?.message || "Failed to create order record");
      }

      const createdOrder = orderData[0];

      // 2. Insert Order Items
      const orderItems = items.map((item) => ({
        order_id: createdOrder.id,
        variant_id: item.variant_id,
        product_title: item.title,
        product_slug: item.slug,
        color_name: item.color_name,
        size_name: item.size_name,
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsErr } = await insforge.database
        .from("order_items")
        .insert(orderItems);

      if (itemsErr) {
        console.warn("Order items insert warning:", itemsErr);
      }

      // 3. Clear cart
      await clearCart();

      setOrderComplete(orderNumber);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error processing order";
      setErrorMsg(message);
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8AA6E] block mb-2">
          Atelier Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-white mb-4">
          Thank you for choosing SYRUS
        </h1>
        <p className="text-xs text-[#888] leading-relaxed max-w-md mx-auto mb-6">
          Your order has been recorded into our private database and dispatched to our logistics team in Northern Italy. Confirmation has been routed to{" "}
          <span className="text-white font-medium">{email}</span>.
        </p>

        <div className="p-6 bg-[#141414] border border-[#262626] max-w-sm mx-auto mb-8 text-left">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#777] mb-1">
            Order Reference
          </div>
          <div className="text-base font-mono font-medium text-white mb-4">
            {orderComplete}
          </div>
          <div className="text-xs text-[#AAA] flex justify-between">
            <span>Total Debited:</span>
            <span className="font-mono text-white">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-8 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#EAEAEA] transition-colors"
          >
            Continue Exploring
          </Link>
          <Link
            href="/orders"
            className="px-8 py-3.5 bg-[#181818] border border-[#333] text-white text-xs uppercase tracking-[0.2em] font-medium hover:border-white transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl text-white mb-2">Your Bag Is Empty</h2>
        <p className="text-xs text-[#888] mb-6">Please select garments before proceeding to checkout.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="mb-10 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8AA6E] block mb-2">
          Secure Atelier Checkout
        </span>
        <h1 className="font-serif text-3xl font-light text-white">
          Complete Your Acquisition
        </h1>
      </div>

      {errorMsg && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Client & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Details */}
          <div className="p-6 bg-[#111] border border-[#222] space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-medium flex items-center justify-between">
              <span>1. Client Contact</span>
              {user && <span className="text-[10px] text-emerald-400 font-normal">Signed In</span>}
            </h3>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-6 bg-[#111] border border-[#222] space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-medium">
              2. Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Julian"
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Vance"
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="740 Park Avenue"
                className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10021"
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                Phone Number (for Courier Dispatch)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 bg-[#111] border border-[#222] space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-medium flex items-center justify-between">
              <span>3. Payment Information</span>
              <div className="flex items-center space-x-1 text-[10px] text-[#888]">
                <Lock size={12} />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </h3>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1">
                  Security Code (CVV)
                </label>
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary: Items & Totals */}
        <div className="lg:col-span-5">
          <div className="p-6 bg-[#121212] border border-[#262626] sticky top-28 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-medium pb-3 border-b border-[#222]">
              Acquisition Summary ({items.length})
            </h3>

            {/* Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-3 text-xs">
                  <div className="w-14 h-18 bg-[#181818] overflow-hidden flex-shrink-0 border border-[#2A2A2A]">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white truncate">{item.title}</p>
                    <p className="text-[11px] text-[#777]">
                      {item.color_name} • Size {item.size_name}
                    </p>
                    <p className="text-[11px] text-[#777] font-mono">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-mono text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-[#222] space-y-2 text-xs">
              <div className="flex justify-between text-[#888]">
                <span>Garment Subtotal</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Worldwide Courier</span>
                <span className="font-mono text-white">
                  {shippingCost === 0 ? "Complimentary" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Import Duties & Tax (Estimated)</span>
                <span className="font-mono text-white">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-[#262626] flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-white">
                  Total Acquisition
                </span>
                <span className="font-serif text-xl font-normal text-white font-mono">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#EAEAEA] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-xl"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authorizing Acquisition...</span>
                </>
              ) : (
                <>
                  <span>Place Order & Authorize</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="text-[10px] text-center text-[#666] uppercase tracking-wider flex items-center justify-center space-x-1.5 pt-1">
              <ShieldCheck size={13} />
              <span>Complimentary Returns • InsForge Authenticated</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

