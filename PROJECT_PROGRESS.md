# SYRUS Luxury Fashion Maison — Project Progress & Architecture Report

> **Project Name:** SYRUS  
> **Status:** Active Development (Local Production & Staging Verified)  
> **Backend Provider:** InsForge BaaS (PostgreSQL, Auth, Storage, Edge Functions)  
> **Last Updated:** October 27, 2026  

---

## 1. Executive Summary

SYRUS is a full-stack luxury fashion e-commerce platform built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3.4, and the InsForge TypeScript SDK. The platform is connected to a dedicated InsForge backend project providing a relational PostgreSQL database, authentication, row-level security, and public object storage buckets.

---

## 2. InsForge Backend Connection Status

- **Status:** Connected & Operational (`HTTP 200 OK`, InsForge OSS Backend `v2.3.5`)
- **Backend Project Subdomain:** `jar7p68m`
- **Region:** `us-east`
- **API Base URL:** `https://jar7p68m.us-east.insforge.app`
- **Database Engine:** PostgreSQL (`insforge`)
- **Database Role:** `project_admin`
- **Public Client Key:** Configured via `NEXT_PUBLIC_INSFORGE_ANON_KEY` in `.env.local`
- **Row Level Security (RLS):** Enabled and enforced across all public application tables

---

## 3. Database Schema Implemented

All tables are active in the `public` schema with configured Row Level Security policies:

| Table | Status | Records | Purpose & Key Structure |
| :--- | :--- | :---: | :--- |
| `categories` | Active | 5 | Fashion departments (Outerwear, Tailoring, Knitwear, Footwear, Leather Goods). Includes `slug`, `image_url`, `display_order`. |
| `colors` | Active | 6 | Palette definitions (Noir Black, Alabaster White, Camel Tan, Espresso Brown, Midnight Navy, Slate Grey) with hex codes. |
| `sizes` | Active | 10 | Garment (`XS`–`XL`), Footwear (`41`–`44 EU`), and Accessory sizes (`One Size`). |
| `products` | Active | 10 | Archival luxury items with noble material specs, care instructions, fit descriptions, gender, and pricing. |
| `product_variants` | Active | 33 | Specific Product + Color + Size matrix with SKUs, price overrides, and `stock_quantity`. |
| `product_images` | Active | 19 | High-resolution editorial photography linked to products and colorways (primary and alternate shots). |
| `profiles` | Active | — | User accounts linked to InsForge Auth users with roles (`customer`, `admin`). |
| `cart_items` | Active | — | Persistent cart items supporting authenticated users and persistent guest sessions. |
| `orders` | Active | — | Order ledger tracking `order_number`, customer info, totals, shipping address, and payment status. |
| `order_items` | Active | — | Historical purchase snapshots with frozen product titles, colors, sizes, and unit prices. |
| `wishlist` | Active | — | User saved products table with unique constraints on `(user_id, product_id)`. |
| `reviews` | Active | 4 | Verified customer impressions, ratings (1–5 stars), and review comments. |

---

## 4. Storage Buckets Implemented

Created through the InsForge Storage MCP infrastructure:

1. **`products`** (Public) — Hosts product lookbook imagery, editorial campaign assets, and category covers.
2. **`avatars`** (Public) — Allocated for client profile pictures and user-submitted media.

---

## 5. Frontend & Application Architecture Implemented

- **Core Framework:** Next.js 16.4.3 (Turbopack compiler), React 19.3.0, TypeScript 5.
- **Styling:** Locked to Tailwind CSS 3.4.17 with PostCSS and Autoprefixer, featuring custom luxury minimalist dark styling, typography tracking, and bespoke scrollbars.
- **InsForge SDK Client (`lib/insforge.ts`):** Centralized client initialization using environment-defined base URL and anonymous keys.
- **Typed Data Layer (`lib/api.ts`):** Safe retrieval utilities for categories, products, variant matrices, and reviews.
- **Authentication Context (`context/AuthContext.tsx`):**
  - Email & password sign-up and sign-in.
  - Native Google & GitHub OAuth initiation.
  - 6-digit OTP code verification flow handler.
  - Automatic session discovery and profile synchronization.
- **Cart Context (`context/CartContext.tsx`):**
  - Database-synchronized cart items via `cart_items` table.
  - Fallback persistent session ID for guest browsing.
  - Real-time stock availability and free shipping calculator ($500+ threshold).
- **Components & Pages:**
  - `Navbar.tsx` — Minimalist editorial navigation with responsive mobile drawer, account dropdown, and dynamic bag badge.
  - `HeroSection.tsx` — Autumn/Winter 2026 editorial campaign banner with call-to-actions.
  - `CategoryBar.tsx` — Horizontal department filtering scroller.
  - `ProductCard.tsx` — Editorial card with dual-image hover transitions, color dot indicators, and price comparison.
  - `ProductDetailClient.tsx` — Interactive PDP with multi-shot gallery, color selection, size selection, inventory stock counter, accordions, and real-time review publishing.
  - `CartDrawer.tsx` — Slide-over bag drawer with free shipping progress bar, quantity adjustments, item removal, and subtotal/duty estimation.
  - `AuthModal.tsx` — Client authentication modal supporting credentials, OAuth, and verification modes.
  - `app/checkout/page.tsx` — Checkout flow recording orders to the database ledger with unique order numbers (`SYR-XXXXXX`).
  - `app/orders/page.tsx` — Client order archive and tracking viewer.
  - `Footer.tsx` — Maison manifesto, craftsmanship pillars, newsletter signup, and client service links.

---

## 6. Known Errors & Issues Resolved

1. **Tailwind CSS v4 Conflict:**
   - *Issue:* Initial Next 16 project attempted to load `@tailwindcss/turbopack` which conflicted with Tailwind v3 configuration.
   - *Resolution:* Locked Tailwind CSS to `3.4.17` with standard `postcss.config.mjs` and `tailwind.config.ts`, removing the experimental loader.
2. **Dynamic Route Segment Warning in Next 16:**
   - *Issue:* `export const dynamic = "force-dynamic"` was causing compiler warnings with Next 16's internal build pipeline.
   - *Resolution:* Removed the redundant segment flag; all dynamic server components now compile cleanly without warnings.
3. **Database Variant Seeding Constraint:**
   - *Issue:* An initial variant seed query encountered duplicate key violations on unique constraint `uq_product_variant`.
   - *Resolution:* Corrected product foreign keys for trousers and boots variants; all 33 variants seeded successfully.

---

## 7. Unfinished Features & Limitations

1. **Payment Gateway Integration:**
   - Currently, checkout creates validated database records (`status: 'processing'`, `payment_status: 'paid'`) via a simulated checkout flow. Direct Stripe Checkout / Razorpay webhooks have not been wired up yet.
2. **Hosting Deployment:**
   - The application has not been deployed to a public hosting environment yet, per instructions to await explicit approval.
3. **SMTP Transactional Mailer:**
   - InsForge backend SMTP is currently disabled (`smtpConfig.enabled: false`). Email verification is handled in-app via code verification or direct sign-in.
4. **Wishlist UI Page:**
   - The `wishlist` database table and RLS policies are active, but a dedicated Wishlist drawer / page component has not yet been built.
5. **Admin Atelier Portal:**
   - Currently, catalog additions are performed via database migrations/seed scripts. An administrative UI for uploading product imagery to the `products` bucket and updating inventory in real-time has not yet been constructed.

---

## 8. Recommended Next Steps

1. **Deployment Approval:** Deploy the Next.js frontend to InsForge hosting via the deployment MCP tool to acquire a public live URL.
2. **Image Storage Integration:** Provide an image upload interface using `@insforge/sdk` storage methods (`insforge.storage.from('products').upload(...)`) for dynamic asset management.
3. **Payment Processor Setup:** Configure Stripe Checkout sessions and edge webhook handlers for credit card processing.
4. **Wishlist Feature:** Add heart icon triggers on `ProductCard` and build a saved-items drawer.
5. **Admin Inventory Dashboard:** Build a protected route (`/admin`) for inventory management and order fulfillment.

