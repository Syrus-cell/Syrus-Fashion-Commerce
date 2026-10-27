import { insforge } from "./insforge";
import { Product, Category, Color, Size, ProductVariant, ProductImage, Review } from "./types";

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await insforge.database
      .from("categories")
      .select()
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return (data || []) as Category[];
  } catch (err) {
    console.error("Failed to get categories:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await insforge.database
      .from("categories")
      .select()
      .eq("slug", slug)
      .limit(1);

    if (error || !data || data.length === 0) return null;
    return data[0] as Category;
  } catch {
    return null;
  }
}

export async function getProducts(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  gender?: string;
  limit?: number;
}): Promise<Product[]> {
  try {
    let query = insforge.database
      .from("products")
      .select()
      .eq("status", "published");

    if (options?.categorySlug) {
      const category = await getCategoryBySlug(options.categorySlug);
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    if (options?.isFeatured) {
      query = query.eq("is_featured", true);
    }

    if (options?.gender) {
      query = query.eq("gender", options.gender);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data: productsData, error: productsError } = await query;
    if (productsError || !productsData || productsData.length === 0) {
      return [];
    }

    const productIds = productsData.map((p: { id: string }) => p.id);

    // Fetch images, variants, colors, and sizes
    const [imagesRes, variantsRes, colorsRes, sizesRes] = await Promise.all([
      insforge.database.from("product_images").select().in("product_id", productIds),
      insforge.database.from("product_variants").select().in("product_id", productIds),
      insforge.database.from("colors").select(),
      insforge.database.from("sizes").select(),
    ]);

    const colorsMap = new Map((colorsRes.data || []).map((c: Color) => [c.id, c]));
    const sizesMap = new Map((sizesRes.data || []).map((s: Size) => [s.id, s]));

    const imagesByProduct = new Map<string, ProductImage[]>();
    (imagesRes.data || []).forEach((img: ProductImage) => {
      const list = imagesByProduct.get(img.product_id) || [];
      list.push(img);
      imagesByProduct.set(img.product_id, list);
    });

    const variantsByProduct = new Map<string, ProductVariant[]>();
    (variantsRes.data || []).forEach((v: ProductVariant) => {
      const list = variantsByProduct.get(v.product_id) || [];
      list.push({
        ...v,
        color: v.color_id ? colorsMap.get(v.color_id) : undefined,
        size: v.size_id ? sizesMap.get(v.size_id) : undefined,
      });
      variantsByProduct.set(v.product_id, list);
    });

    return productsData.map((prod: Product) => ({
      ...prod,
      images: (imagesByProduct.get(prod.id) || []).sort((a, b) => a.display_order - b.display_order),
      variants: variantsByProduct.get(prod.id) || [],
    }));
  } catch (err) {
    console.error("Failed to get products:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data: prodData, error: prodError } = await insforge.database
      .from("products")
      .select()
      .eq("slug", slug)
      .limit(1);

    if (prodError || !prodData || prodData.length === 0) return null;
    const product = prodData[0] as Product;

    // Fetch associated images, variants, colors, sizes, reviews, and category
    const [imagesRes, variantsRes, colorsRes, sizesRes, reviewsRes, catRes] = await Promise.all([
      insforge.database
        .from("product_images")
        .select()
        .eq("product_id", product.id)
        .order("display_order", { ascending: true }),
      insforge.database.from("product_variants").select().eq("product_id", product.id),
      insforge.database.from("colors").select(),
      insforge.database.from("sizes").select(),
      insforge.database.from("reviews").select().eq("product_id", product.id),
      product.category_id
        ? insforge.database.from("categories").select().eq("id", product.category_id).limit(1)
        : { data: [] },
    ]);

    const colorsMap = new Map((colorsRes.data || []).map((c: Color) => [c.id, c]));
    const sizesMap = new Map((sizesRes.data || []).map((s: Size) => [s.id, s]));

    const enrichedVariants: ProductVariant[] = (variantsRes.data || []).map((v: ProductVariant) => ({
      ...v,
      color: v.color_id ? colorsMap.get(v.color_id) : undefined,
      size: v.size_id ? sizesMap.get(v.size_id) : undefined,
    }));

    return {
      ...product,
      category: catRes.data && catRes.data.length ? (catRes.data[0] as Category) : undefined,
      images: (imagesRes.data || []) as ProductImage[],
      variants: enrichedVariants,
    };
  } catch (err) {
    console.error("Failed to get product by slug:", err);
    return null;
  }
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await insforge.database
      .from("reviews")
      .select()
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data || []) as Review[];
  } catch {
    return [];
  }
}

