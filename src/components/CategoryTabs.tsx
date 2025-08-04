"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "../types/product";
import { fetchAllCategories } from "../lib/categories";
import { Category } from "../types/category";

interface CategoryTabsProps {
  onCategoryChange?: (products: Product[]) => void;
  onCategorySelect: (category: string) => void;
  activeCategory: string;
  className?: string;
}

// Category display names mapping
const categoryDisplayNames = {
  all: "Все товары",
  cartriges: "Картриджи",
  pods: "Под-системы",
  chaser: "Chaser",
  octobar: "Octobar",
  fl: "FL",
};

export default function CategoryTabs({
  onCategoryChange,
  onCategorySelect,
  activeCategory,
  className = "",
}: CategoryTabsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await fetchAllCategories();
        setCategories(result);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    }
    loadCategories();
  }, [activeCategory, onCategoryChange]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  if (categories.length === 0) {
    return (
      <div className={`flex justify-center items-center py-4 ${className}`}>
        <p className="text-gray-500">Загрузка категорий...</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg ${className}`}
    >
      {/* Category Tabs */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          onWheel={handleWheel}
        >
          <div className="flex space-x-2 p-4 min-w-max">
            <button
              key={"all"}
              onClick={() => onCategorySelect("all")}
              // disabled={!hasProducts}
              className={`
                    px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap
                    transition-all duration-200 flex-shrink-0
                    ${
                      activeCategory === "all"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
            >
              {"Все товары"}
              {/* {hasProducts && (
                    <span
                      className={`
                      ml-2 px-2 py-0.5 rounded-full text-xs
                      ${isActive ? "bg-blue-500" : "bg-gray-200"}
                    `}
                    >
                      {products.length}
                    </span>
                  )} */}
            </button>
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              // const products = getProductsByCategory(
              //   category as keyof Database
              // );
              // const hasProducts = products.length > 0;

              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  // disabled={!hasProducts}
                  className={`
                    px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap
                    transition-all duration-200 flex-shrink-0
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : // : hasProducts
                          "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      // : "bg-gray-50 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {categoryDisplayNames[
                    category.name as keyof typeof categoryDisplayNames
                  ] || category.name}
                  {/* {hasProducts && (
                    <span
                      className={`
                      ml-2 px-2 py-0.5 rounded-full text-xs
                      ${isActive ? "bg-blue-500" : "bg-gray-200"}
                    `}
                    >
                      {products.length}
                    </span>
                  )} */}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gradient overlay for scroll indication */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
