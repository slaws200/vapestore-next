import { Category } from "@/types/category";
import Image from "next/image";
import { categoryNamesRu } from "@/utils/constants";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <div className={`h-full flex flex-col justify-between`}>
      <div className="relative aspect-square bg-gray-100 rounded-md">
        <Image
          src={
            category.image.startsWith("http")
              ? category.image
              : `/${category.image}`
          }
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <h2 className="text-xs font-semibold text-gray-900">
          {categoryNamesRu[category.name]}
        </h2>
      </div>
    </div>
  );
}
