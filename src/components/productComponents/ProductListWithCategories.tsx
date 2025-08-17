"use client";

import { ReactEventHandler, useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllProducts, fetchProductsByCategoryId } from "@/lib/products";
import { Product } from "@/types/product";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "./ProductCard";
import { Category } from "@/types/category";

type CategoryId = string | "all";

interface IProductListProps {
  preloadedData?: Product[];
  startOffset?: [number, number];
  preloadedCategories?: Category[];
}

export default function ProductListWithCategories({
  preloadedData = [],
  startOffset = [0, 11],
  preloadedCategories = [],
}: IProductListProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [products, setProducts] = useState<Product[]>(preloadedData);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(startOffset);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = async (category: CategoryId, reset = false) => {
    setLoading(true);
    try {
      if (category === "all") {
        const result = await fetchAllProducts(offset[0], offset[1]);
        setProducts((prev) => (reset ? result : [...prev, ...result]));
        if (result.length < 11) {
          setHasMore(false);
        }
      } else {
        const result = await fetchProductsByCategoryId(category);
        setProducts(result);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: CategoryId) => {
    setActiveCategory(category);
    setOffset([0, 11]);
    setHasMore(true);
    loadProducts(category, true); // reset = true
  };

  const handleScroll: ReactEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // console.log(e);
    // console.log(e.currentTarget);
    // console.log(scrollTop, scrollHeight, clientHeight);
    if (!loading && hasMore) {
      if (scrollTop + clientHeight === scrollHeight) {
        setOffset((prev) => [prev[0] + 12, prev[1] + 12]);
      }
    }
  };

  useEffect(() => {
    if (activeCategory === "all" && offset[0] === 0) {
      if (!preloadedData.length) {
        loadProducts(activeCategory, true);
      }
    } else if (activeCategory === "all" && offset[0]) {
      loadProducts(activeCategory);
    }
  }, [offset]);

  if (loading && products.length === 0) {
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
    <div
      onScroll={handleScroll}
      className="max-h-[100vh] pt-14 pb-20 overflow-y-auto scrollbar-hide "
    >
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
        preloadedCategories={preloadedCategories}
      />

      {loading && (
        <p className="text-center text-gray-400 text-sm pt-4">Загрузка...</p>
      )}
      {!hasMore && activeCategory === "all" && (
        <p className="text-center text-gray-300 text-xs pt-4">
          Больше товаров нет
        </p>
      )}
    </div>
  );
}
