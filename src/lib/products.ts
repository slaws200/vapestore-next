import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";
// Получить все продукты
export async function fetchAllProducts(
  from: number,
  to: number
): Promise<Product[]> {
  // В выдачу должны попадать только товары из активных категорий
  const { data: activeCategories, error: categoriesError } = await supabase
    .from("categories")
    .select("id")
    .eq("active", true);

  if (categoriesError) throw categoriesError;

  const activeCategoryIds = (activeCategories ?? []).map((c) => c.id);
  if (activeCategoryIds.length === 0) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("category_id", activeCategoryIds)
    .order("available", { ascending: false }) // доступные первыми
    .order("id_bigserial", { ascending: true }) // потом по id
    .range(from, to);

  if (error) throw error;
  return data || [];
}

// Получить продукт по ID
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}
// Получить продукты по ID категории
export async function fetchProductsByCategoryId(
  categoryId: string | "all"
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .order("available", { ascending: false }) // доступные первыми
    .order("id_bigserial", { ascending: true }); // потом по id

  if (error) throw error;
  return data || [];
}

export async function addProduct(
  product: Omit<Product, "id" | "id_bigserial">
) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { data, error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
  return data;
}
