"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useTelegram } from "@/hooks/useTelegram";
import { ProductImage } from "@/components/productComponents/ProductImage";
import { ProductInfo } from "@/components/productComponents/ProductInfo";
import EditForm from "../EditForm";

interface ProductDetailCardProps {
  product: Product;
}

export default function ProductDetailCard({ product }: ProductDetailCardProps) {
  const { userData } = useTelegram();
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-h-[100vh] overflow-y-auto scrollbar-hide">
      <button
        className="w-10 h-10 bg-gray-900"
        onClick={() => setIsEdit(!isEdit)}
      ></button>
      {isEdit ? (
        <EditForm categoryId={product.category_id} />
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
