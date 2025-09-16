"use client";

import CategoryTabs from "@/components/CategoryTabs";
import { useProductsByCategory } from "@/hooks/useProducts";
import { fetchAllProducts } from "@/lib/products";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import Link from "next/link";
import { ReactEventHandler, useEffect, useRef, useState } from "react";
import Loader from "../loader";
import ProductCard from "./ProductCard";
import { useGlobalLoaderStore } from "@/lib/store/globalLoaderStore";
import { useAllCategoriesStore } from "@/lib/store/allCategories";

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
  const { activeCategory, setActiveCategory } = useCategoryStore();
  const { setIsLoading } = useGlobalLoaderStore();
  const [products, setProducts] = useState<Product[]>(preloadedData);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(startOffset);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setAllCategories } = useAllCategoriesStore();

  const {
    data: categoryProducts,
    isLoading: isLoadingCategory,
    error: categoryError,
  } = useProductsByCategory(activeCategory);

  const loadProducts = async (category: CategoryId, reset = false) => {
    setLoading(true);
    try {
      if (category === "all") {
        const result = await fetchAllProducts(offset[0], offset[1]);
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

  useEffect(() => {
    if (activeCategory !== "all") {
      if (categoryProducts) {
        setProducts(categoryProducts);
        setHasMore(false);
      }
    }
  }, [activeCategory, categoryProducts, offset, preloadedData.length]);

  const handleCategorySelect = (category: CategoryId) => {
    setActiveCategory(category);
    setHasMore(true);
    setOffset([0, 11]);
  };

  const handleScroll: ReactEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current ?? e.currentTarget;
    if (!loading && hasMore && activeCategory === "all") {
      if (scrollTop + clientHeight > scrollHeight - 21) {
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

  useEffect(() => {
    setIsLoading(isLoadingCategory);
  }, [isLoadingCategory]);
  useEffect(() => {
    try {
      fetch("https://mybot-pmod.onrender.com/", { method: "GET" });
    } catch (error) {
      console.error("Ошибка при разбудке сервера:", error);
    }
  }, []);

  useEffect(() => {
    setAllCategories(preloadedCategories);
  }, []);

  if (activeCategory !== "all" && isLoadingCategory && products.length === 0) {
    return <Loader />;
  }

  if (activeCategory !== "all" && categoryError) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <p className="text-red-500 text-lg">
          Ошибка загрузки товаров: {categoryError.message}
        </p>
      </div>
    );
  }

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
      className="max-h-[100vh] overflow-y-auto scrollbar-hide py-12 pb-20"
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
            onClick={() => setIsLoading(true)}
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>

      {loading && <Loader />}
      {!hasMore && activeCategory === "all" && (
        <p className="text-center text-gray-300 text-xs pt-3">
          Больше товаров нет
        </p>
      )}
    </div>
  );
}
