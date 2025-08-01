"use client";

import { useState, useEffect, useRef } from "react";
import { getProductsByCategory, Database } from "../lib/products";
import { Product } from "../types/product";

interface CategoryTabsProps {
  onCategoryChange?: (products: Product[]) => void;
  onCategorySelect?: (category: keyof Database | "all") => void;
  activeCategory?: keyof Database | "all";
  className?: string;
}

// Extended type to include "all" category
type ExtendedCategory = keyof Database | "all";

// Category display names mapping
const categoryDisplayNames: Record<ExtendedCategory, string> = {
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
  activeCategory: externalActiveCategory,
  className = "",
}: CategoryTabsProps) {
  const [internalActiveCategory, setInternalActiveCategory] =
    useState<ExtendedCategory>("all");
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use external active category if provided, otherwise use internal state
  const activeCategory = externalActiveCategory || internalActiveCategory;

  useEffect(() => {
    // Extract categories from the database structure, including "all"
    const dbCategories: ExtendedCategory[] = [
      "all",
      "cartriges",
      "pods",
      "chaser",
      "octobar",
      "fl",
    ];
    setCategories(dbCategories);
  }, []);

  useEffect(() => {
    // Load products for the active category
    const products = getProductsByCategory(activeCategory as keyof Database);
    onCategoryChange?.(products);
  }, [activeCategory, onCategoryChange]);

  const handleCategoryClick = (category: ExtendedCategory) => {
    if (externalActiveCategory !== undefined) {
      // If external state is provided, call the callback
      onCategorySelect?.(category);
    } else {
      // Otherwise, use internal state
      setInternalActiveCategory(category);
    }
  };

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
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const products = getProductsByCategory(
                category as keyof Database
              );
              const hasProducts = products.length > 0;

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  disabled={!hasProducts}
                  className={`
                    px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap
                    transition-all duration-200 flex-shrink-0
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : hasProducts
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {categoryDisplayNames[category]}
                  {hasProducts && (
                    <span
                      className={`
                      ml-2 px-2 py-0.5 rounded-full text-xs
                      ${isActive ? "bg-blue-500" : "bg-gray-200"}
                    `}
                    >
                      {products.length}
                    </span>
                  )}
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
