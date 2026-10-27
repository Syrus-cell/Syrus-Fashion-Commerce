export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Color {
  id: string;
  name: string;
  slug: string;
  hex_code: string;
  display_order: number;
}

export interface Size {
  id: string;
  name: string;
  category: 'clothing' | 'shoes' | 'accessories';
  display_order: number;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: string | null;
  material: string | null;
  care: string | null;
  fit: string | null;
  gender: 'men' | 'women' | 'unisex';
  category_id: string | null;
  base_price: number;
  compare_at_price: number | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_id: string | null;
  size_id: string | null;
  sku: string;
  price_override: number | null;
  stock_quantity: number;
  is_active: boolean;
  color?: Color;
  size?: Size;
}

export interface ProductImage {
  id: string;
  product_id: string;
  color_id: string | null;
  url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  variant?: ProductVariant & {
    product?: Product;
    color?: Color;
    size?: Size;
  };
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string | null;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
}

