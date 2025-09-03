"use client";

import CategoryCard from "@/components/categoriesComponents/CategoryCard";
import { useBackButton } from "@/hooks/useBackButton";
import { Category } from "@/types/category";
import { redirect } from "next/navigation";

interface ICategoriesPageProps {
  initialCategories: Category[];
}

export default function CategoriesPageClient({
  initialCategories,
}: ICategoriesPageProps) {
  useBackButton(() => redirect("/"));
  return (
    <div className="p-4 pt-0 px-10 pb-20">
      <h1 className="text-gray-900 text-lg font-bold mb-2">Все категории</h1>
      <div className="grid grid-cols-2 gap-4">
        {initialCategories.map((item: Category) => (
          <CategoryCard key={item.id} category={item} />
        ))}
      </div>
    </div>
  );
}
