"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useTelegram } from "@/hooks/useTelegram";
import { ProductImage } from "@/components/productComponents/ProductImage";
import { ProductInfo } from "@/components/productComponents/ProductInfo";
import EditForm from "../EditForm";
import { adminsIds } from "@/utils/constants";

interface ProductDetailCardProps {
  product: Product;
}

export default function ProductDetailCard({ product }: ProductDetailCardProps) {
  const { userData } = useTelegram();
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-h-[100vh] overflow-y-auto scrollbar-hide">
      {userData && adminsIds.includes(userData?.id) ? (
        <button
          className="p-2 bg-gray-500 rounded-lg"
          onClick={() => setIsEdit(!isEdit)}
        >
          {isEdit ? "Выйти из редактирования" : "Режим редактирования"}
        </button>
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
