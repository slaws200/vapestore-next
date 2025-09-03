"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { uploadProductImage } from "@/lib/uploadImage";
import { Product } from "@/types/product";
import { v4 as uuidv4 } from "uuid";
import { useAddProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useTelegramPopup } from "@/hooks/useTelegramPopup";
import { redirect, RedirectType } from "next/navigation";
import { viewport } from "@/app/layout";

type ProductFormProps = {
  product?: Product;
  categoryId: string;
  onSuccess?: () => void;
};

type FormValues = {
  name: string;
  price: number;
  description?: string;
  stock?: number;
  available: boolean;
  image?: FileList;
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

  const id = product?.id ?? String(uuidv4());

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { openPopup } = useTelegramPopup();

  const addMutation = useAddProduct(categoryId);
  const updateMutation = useUpdateProduct(categoryId);

  const onSubmit = async (values: FormValues) => {
    try {
      let imageUrl = product?.image;

      if (values.image && values.image.length > 0) {
        const file = values.image[0];
        imageUrl = await uploadProductImage(file, id);
      }

      const payload = { ...values, image: imageUrl || "" };

      if (product) {
        updateMutation.mutate(
          { id: product.id, product: payload },
          {
            onSuccess: async () => {
              const res = await openPopup({
                title: "Успех",
                message: "Товар успешно обновлен!",
                buttons: [{ id: "ok", type: "close", text: "Закрыть" }],
              });
              if (res === "ok") {
                onSuccess?.();
                redirect(`/${product.id}`, RedirectType.replace);
              }
            },
            onError: (e) => {
              openPopup({
                title: "Ошибка",
                message: "Ошибка при обновлении",
                buttons: [
                  { id: "error", type: "destructive", text: "Закрыть" },
                ],
              });
              setErrorMessage(e.message);
            },
          }
        );
      } else {
        addMutation.mutate(payload, {
          onSuccess: () => {
            openPopup({
              title: "Успех",
              message: "Товар успешно добавлен!",
              buttons: [{ id: "ok", type: "close", text: "Закрыть" }],
            });
            onSuccess?.();
          },
          onError: (e) => {
            openPopup({
              title: "Ошибка",
              message: "Ошибка при добавлении товара",
              buttons: [{ id: "error", type: "destructive", text: "Закрыть" }],
            });
            setErrorMessage(e.message);
          },
        });
      }
    } catch (e) {
      setErrorMessage((e as Error).message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-3 rounded-lg text-gray-900 text-xs"
    >
      <label>
        Название
        <input
          {...register("name", { required: "Обязательное поле" })}
          className="border border-gray-300 p-2 w-full bg-white rounded-sm"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </label>

      <label>
        Цена
        <input
          type="number"
          {...register("price", {
            required: "Укажите цену",
            valueAsNumber: true,
          })}
          className="border border-gray-300 p-2 w-full bg-white rounded-sm"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </label>

      <label>
        Описание
        <textarea
          {...register("description")}
          className="border border-gray-300 p-2 w-full min-h-30 bg-white rounded-sm"
        />
      </label>

      <label>
        Остаток на складе
        <input
          type="number"
          {...register("stock", { valueAsNumber: true })}
          className="border border-gray-300 p-2 w-full bg-white rounded-sm"
        />
      </label>

      <label className="flex items-center gap-2 cursor-pointer select-none group">
        <input type="checkbox" {...register("available")} className="sr-only" />
        <div className="w-11 h-6 bg-gray-300 rounded-full relative transition-colors duration-300 ease-in-out group-has-[:checked]:bg-blue-500">
          <div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md
                 transition-transform duration-300 ease-in-out
                 group-has-[:checked]:translate-x-5"
          />
        </div>
        <span className="text-gray-900">В наличии / Не в наличии</span>
      </label>

      <label>
        Картинка
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="border border-gray-300 p-2 w-full bg-white rounded-sm"
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
        disabled={
          isSubmitting || addMutation.isPending || updateMutation.isPending
        }
        className="bg-blue-600 text-white py-2 rounded"
      >
        {product ? "Сохранить изменения" : "Добавить продукт"}
      </button>
    </form>
  );
}
