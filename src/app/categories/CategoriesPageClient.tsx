"use client";

import CategoryCard from "@/components/categoriesComponents/CategoryCard";
import { useBackButton } from "@/hooks/useBackButton";
import { fetchAllCategories } from "@/lib/categories";
import { useAllCategoriesStore } from "@/lib/store/allCategories";
import { Category } from "@/types/category";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function CategoriesPageClient() {
  useBackButton(() => redirect("/"));
  const { setAllCategories, allCategories } = useAllCategoriesStore();

  useEffect(() => {
    if (!allCategories.length) {
      fetchAllCategories().then((res) => setAllCategories(res));
    }
  }, []);

  return (
    <div className="p-4 pt-0 px-10 pb-20">
      <h1 className="text-gray-900 text-lg font-bold mb-2">Все категории</h1>
      <div className="grid grid-cols-2 gap-4">
        {allCategories.map((item: Category) => (
          <CategoryCard key={item.id} category={item} />
        ))}
      </div>
    </div>
  );
}
