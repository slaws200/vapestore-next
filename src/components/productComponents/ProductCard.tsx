import { Product } from "@/types/product";
import Image from "next/image";
import React from "react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="relative aspect-square bg-gray-100 rounded-md mb-1">
        <Image
          src={`/${product.image}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
          loading="lazy"
          placeholder="blur"
          blurDataURL={product.image}
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">
          {product.name}
        </h2>
        <div>
          <p className="text-blue-600 font-bold text-sm mb-1">
            ₽{product.price}
          </p>
          <span
            className={`text-sm font-medium ${
              product.stock! > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock! > 0
              ? `${product.stock} в наличии`
              : "Нет в наличии"}
          </span>
        </div>
      </div>
    </div>
  );
}
