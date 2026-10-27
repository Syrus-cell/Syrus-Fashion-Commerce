import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews } from "@/lib/api";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  return <ProductDetailClient product={product} initialReviews={reviews} />;
}
