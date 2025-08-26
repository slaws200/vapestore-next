import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";
// Получить все продукты
export async function fetchAllProducts(
  from: number,
  to: number
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .range(from, to);
  if (error) throw error;
  return data || [];
}

// Получить продукт по ID
export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
// Получить продукты по ID категории
export async function fetchProductsByCategoryId(
  categoryId: string | "all"
): Promise<Product[]> {
  // if (categoryName === "all") {
  //   return fetchAllProducts();
  // }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId);

  if (error) throw error;
  return data || [];
}

export async function addProduct(product: Omit<Product, "id">) {
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

// // Добавить продукт
// export async function createProduct(product: Partial<Product>) {
//   const { data, error } = await supabase.from("products").insert(product);
//   if (error) throw error;
//   return data;
// }

// // Удалить
// export async function deleteProduct(id: string) {
//   const { error } = await supabase.from("products").delete().eq("id", id);
//   if (error) throw error;
// }
