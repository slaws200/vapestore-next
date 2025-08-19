"use client";

import { ReactEventHandler, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { fetchAllProducts, fetchProductsByCategoryId } from "@/lib/products";
import { Product } from "@/types/product";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "./ProductCard";
import { Category } from "../../types/category";
import Loader from "../loader";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        const result = await fetchProductsByCategoryId(
          category,
          offset[0],
          offset[1]
        );
        setProducts((prev) => (reset ? result : [...prev, ...result]));
        if (result.length < 11) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: CategoryId) => {
    setActiveCategory(category);
    setHasMore(true);
    setOffset([0, 11]);
  };

  const handleScroll: ReactEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current ?? e.currentTarget;
    if (!loading && hasMore) {
      if (scrollTop + clientHeight === scrollHeight) {
        setOffset((prev) => [prev[0] + 12, prev[1] + 12]);
      }
    }
  };

  useEffect(() => {
    if (offset[0] === 0) {
      if (activeCategory === "all") {
        if (!preloadedData.length || preloadedData.length <= 12) {
          loadProducts(activeCategory, true);
        }
      } else {
        loadProducts(activeCategory, true);
      }
    } else {
      loadProducts(activeCategory);
    }
  }, [offset, activeCategory]);

  useEffect(() => {
    if (loading && scrollContainerRef.current && offset[0] !== 0) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [loading]);

  if (loading && products.length === 0) {
    return <Loader />;
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
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="max-h-[100vh] overflow-y-auto scrollbar-hide pt-14"
    >
      <CategoryTabs
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        preloadedCategories={preloadedCategories}
      />
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

      {loading && <Loader />}
      {!hasMore && activeCategory === "all" && (
        <p className="text-center text-gray-300 text-xs pt-4">
          Больше товаров нет
        </p>
      )}
    </div>
  );
}
