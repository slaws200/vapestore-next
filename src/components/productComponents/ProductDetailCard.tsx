"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useTelegram } from "@/hooks/useTelegram";
import { ProductImage } from "@/components/productComponents/ProductImage";
import { ProductInfo } from "@/components/productComponents/ProductInfo";
import EditForm from "../EditForm";
import { adminsIds } from "@/utils/constants";
import { useTelegramPopup } from "../../hooks/useTelegramPopup";
import { useDeleteProduct } from "../../hooks/useProducts";
import { useHapticFeedback } from "../../hooks/useHapticFeedback";
import { redirect, RedirectType } from "next/navigation";
import { useBackButton } from "@/hooks/useBackButton";

interface ProductDetailCardProps {
  product: Product;
}

export default function ProductDetailCard({ product }: ProductDetailCardProps) {
  const { userData } = useTelegram();
  const { openPopup } = useTelegramPopup();
  const { impact } = useHapticFeedback();
  const deleteMutation = useDeleteProduct();
  const [isEdit, setIsEdit] = useState(false);
  useBackButton(() => redirect("/", RedirectType.replace));

  return (
    <div>
      {userData && adminsIds.includes(userData?.id) ? (
        <div className="flex justify-center" role="group">
          <button
            type="button"
            onClick={() => setIsEdit(!isEdit)}
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700"
          >
            {isEdit ? "Выйти из редактирования" : "Режим редактирования"}
          </button>
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={async () => {
              const res = await openPopup({
                title: "Вы уверены?",
                message:
                  "Это действие нельзя отменить, товар будет удален навсегда.",
                buttons: [
                  { id: "ok", type: "ok", text: "Да" },
                  { id: "cancel", type: "destructive", text: "Отмена" },
                ],
              });
              if (res !== "ok") {
                impact("heavy");
                return;
              }
              if (res === "ok") {
                impact("rigid");
                deleteMutation.mutate(product, {
                  onSuccess: async () => {
                    const res = await openPopup({
                      title: "Успех",
                      message: "Товар успешно удален!",
                      buttons: [{ id: "ok", type: "close", text: "Закрыть" }],
                    });
                    if (res === "ok") {
                      redirect("/", RedirectType.replace);
                    }
                  },
                  onError: () => {
                    openPopup({
                      title: "Ошибка",
                      message: "Товар не удалось удалить",
                      buttons: [
                        { id: "error", type: "destructive", text: "Закрыть" },
                      ],
                    });
                  },
                });
              }
            }}
            className="px-4 py-2 text-sm font-medium text-red-500 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700"
          >
            Удалить товар
          </button>
        </div>
      ) : null}
      {isEdit ? (
        <EditForm
          categoryId={product.category_id}
          product={product}
          onSuccess={() => setIsEdit(false)}
        />
      ) : (
        <div className="max-w-4xl mx-auto p-4">
          <div className="rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <ProductImage product={product} />
              </div>
              <ProductInfo product={product} userData={userData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
