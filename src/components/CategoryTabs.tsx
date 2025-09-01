"use client";

import { useRef } from "react";
import { Category } from "../types/category";
import { categoryNamesRu } from "../utils/constants";

interface CategoryTabsProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
  className?: string;
  preloadedCategories: Category[];
}

export default function CategoryTabs({
  onCategorySelect,
  activeCategory,
  className = "",
  preloadedCategories,
}: CategoryTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  if (preloadedCategories.length === 0) {
    return (
      <div className={`flex justify-center items-center py-4 ${className}`}>
        <p className="text-gray-500">Загрузка категорий...</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg ${className}`}
    >
      {/* Category Tabs */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          onWheel={handleWheel}
        >
          <div className="flex space-x-2 p-2 min-w-max">
            <button
              key={"all"}
              onClick={() => onCategorySelect("all")}
              className={`
                    px-4 py-1 rounded-lg font-medium text-sm whitespace-nowrap
                    transition-all duration-200 flex-shrink-0
                    ${
                      activeCategory === "all"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
            >
              {"Все товары"}
            </button>
            {preloadedCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`
                    px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                    transition-all duration-200 flex-shrink-0
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {categoryNamesRu[
                    category.name as keyof typeof categoryNamesRu
                  ] || category.name}
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
