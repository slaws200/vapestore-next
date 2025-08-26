"use client";

import { Product } from "@/types/product";
import { useTelegram } from "@/hooks/useTelegram";
import { ProductImage } from "@/components/productComponents/ProductImage";
import { ProductInfo } from "@/components/productComponents/ProductInfo";

interface ProductDetailCardProps {
  product: Product;
}

export default function ProductDetailCard({ product }: ProductDetailCardProps) {
  const { userData } = useTelegram();

  return (
    <div className="min-h-screen overflow-y-hidden">
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
    </div>
  );
}
