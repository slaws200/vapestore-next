"use client";

// import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAllProducts, fetchProductsByCategoryId } from "@/lib/products";
import { Product } from "@/types/product";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

export default function ProductListWithCategories() {
  // const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState([0, 9]);

  const handleCategorySelect = (arg: string) => {
    setActiveCategory(arg);
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        if (activeCategory === "all") {
          const result = await fetchAllProducts(pagination[0], pagination[1]);
          setProducts(result);
        } else {
          const result = await fetchProductsByCategoryId(activeCategory);
          setProducts(result);
        }
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [activeCategory]);

  if (loading) {
    return <p className="text-center py-8">Загрузка...</p>;
  }

  if (!products.length) {
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
      <div className="grid grid-cols-3 gap-2">
        {products.map((product: Product) => (
          <Link
            key={product.id}
            href={`/${product.id}`}
            className="bg-white rounded-lg shadow-md p-2 flex flex-col hover:shadow-lg transition"
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
