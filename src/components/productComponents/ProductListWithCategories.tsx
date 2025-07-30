"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductsByCategory, Database } from "@/lib/products";
import { Product } from "@/types/product";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "./ProductCard";

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

  if (!currentProducts.length) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <p className="text-gray-500 text-lg">
          Нет товаров в выбранной категории
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[100vh] pt-14 pb-20 overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {currentProducts.map((product: Product) => (
          <Link
            key={product.id}
            href={`/${product.id}`}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>

      <CategoryTabs
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
      />
    </div>
  );
}
