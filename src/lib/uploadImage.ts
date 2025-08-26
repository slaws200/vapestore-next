// lib/uploadImage.ts
import { supabase } from "../utils/supabase/client";

export async function uploadProductImage(file: File, productId: string) {
//   const fileExt = file.name.split(".").pop();
//   const fileName = `${productId}`;
//   const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(productId, file, {
      cacheControl: "3600",
      upsert: true, // если обновляем картинку
    });

  if (uploadError) throw uploadError;

  // получаем публичный URL
  const { data } = supabase.storage.from("products").getPublicUrl(productId);

  return data.publicUrl;
}
