import { supabase } from "@/utils/supabase/client";
import { Category } from "@/types/category";

// Получить все категории
export async function fetchAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data || [];
}

export async function addCategory(input: {
  name: string;
  active: boolean;
  image?: string;
}): Promise<Category> {
  const payload: { name: string; active: boolean; image?: string } = {
    name: input.name,
    active: input.active,
  };

  // Если картинка не передана, оставляем ее на усмотрение БД (default/null).
  if (input.image !== undefined) payload.image = input.image;

  const { data, error } = await supabase
    .from("categories")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategoryActive(
  id: string,
  active: boolean
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({ active })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}
