// import SearchInput from "@/components/SearchInput";
import ProductListWithCategories from "@/components/productComponents/ProductListWithCategories";
import TelegramInit from "@/components/TelegramInit";
import { fetchAllCategories } from "../lib/categories";
import { Category } from "@/types/category";

export default async function Home() {
  let categories: Category[] = [];

  try {
    categories = await fetchAllCategories();
  } catch (error) {
    console.error("Ошибка загрузки категорий:", error);
  }

  return (
    <main className="min-h-screen overflow-y-hidden bg-linear-to-r from-zinc-300 to-zinc-900">
      {/* <TelegramInit /> */}
      <div className="mx-auto px-4">
        {/* <SearchInput /> */}
        <ProductListWithCategories allCategories={categories} />
      </div>
    </main>
  );
}
