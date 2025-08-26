import { Product } from "@/types/product";
import Image from "next/image";
import React from "react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="h-full flex flex-col justify-between ">
      <div className="relative aspect-square bg-gray-100 rounded-md mb-1">
        <Image
          src={
            product.image.startsWith("http")
              ? product.image
              : `/${product.image}`
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <h2 className="text-xs font-semibold text-gray-900 mb-1">
          {product.name}
        </h2>
        <div>
          <p className="text-blue-600 font-bold text-xs">₽{product.price}</p>
          <span
            className={`text-xs font-medium ${
              product.available ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.available ? "В наличии" : "Нет в наличии"}
          </span>
        </div>
      </div>
    </div>
  );
}
