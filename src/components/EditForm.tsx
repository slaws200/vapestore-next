"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { addProduct, updateProduct } from "@/lib/products";
import { uploadProductImage } from "@/lib/uploadImage";
import { Product } from "@/types/product";
import { randomUUID } from "crypto";

type ProductFormProps = {
  product?: Product;
  categoryId: string;
  onSuccess?: (product: Product) => void;
};

type FormValues = {
  name: string;
  price: number;
  description?: string;
  stock?: number;
  available: boolean;
  image?: FileList; // теперь это файл
  category_id: string;
};

export default function EditForm({
  product,
  categoryId,
  onSuccess,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      description: product?.description || "",
      stock: product?.stock || 0,
      available: product?.available ?? true,
      category_id: categoryId,
    },
  });

  const id = product?.id || randomUUID;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      let imageUrl = product?.image;

      // если новый файл загружен
      if (values.image && values.image.length > 0) {
        const file = values.image[0];
        imageUrl = await uploadProductImage(file, id as string);
      }

      let saved: Product;
      if (product) {
        saved = await updateProduct(product.id, {
          ...values,
          image: imageUrl,
        });
      } else {
        saved = await addProduct({
          ...values,
          image: imageUrl || "",
        });
      }

      if (onSuccess) onSuccess(saved);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 border rounded-lg text-gray-900"
    >
      <label>
        Название
        <input
          {...register("name", { required: "Обязательное поле" })}
          className="border p-2 w-full"
        />
      </label>

      <label>
        Цена
        <input
          type="number"
          {...register("price", {
            required: "Укажите цену",
            valueAsNumber: true,
          })}
          className="border p-2 w-full"
        />
      </label>

      <label>
        Описание
        <textarea {...register("description")} className="border p-2 w-full" />
      </label>

      <label>
        Остаток на складе
        <input
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className="border p-2 w-full"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("available")} />
        Доступен
      </label>

      <label>
        Картинка
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="border p-2 w-full"
        />
        {product?.image && (
          <div className="mt-2">
            <img
              src={product.image}
              alt="preview"
              className="w-32 h-32 object-cover border"
            />
          </div>
        )}
      </label>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white py-2 rounded"
      >
        {product ? "Сохранить изменения" : "Добавить продукт"}
      </button>
    </form>
  );
}
