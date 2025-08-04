import { supabase } from "@/utils/supabase/client";
import { Category } from "@/types/category";

// Получить все категории
export async function fetchAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data || [];
}
