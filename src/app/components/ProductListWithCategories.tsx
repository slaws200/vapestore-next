"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductsByCategory, Database } from "../lib/products";
import { Product } from "../types/product";
import CategoryTabs from "./CategoryTabs";

export default function ProductListWithCategories() {
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<keyof Database | "all">(
    "all"
  );

  // Load products for the active category
  useEffect(() => {
    const products = getProductsByCategory(activeCategory);
    setCurrentProducts(products);
  }, [activeCategory]);

  const handleCategorySelect = (category: keyof Database | "all") => {
    setActiveCategory(category);
  };

  return (
    <div className="pb-32">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {currentProducts.length > 0 ? (
          currentProducts.map((product: Product) => (
            <Link
              key={product.id}
              href={`/${product.id}`}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="relative aspect-square bg-gray-100 rounded-lg mb-2">
                  <Image
                    src={`/${product.image}`}
                    alt={product.name}
                    fill
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
            </Link>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-500 text-lg">
              Нет товаров в выбранной категории
            </p>
          </div>
        )}
      </div>

      {/* Fixed Category Tabs at Bottom */}
      <CategoryTabs
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
      />
    </div>
  );
}
