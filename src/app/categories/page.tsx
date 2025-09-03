import { fetchAllCategories } from "@/lib/categories";
import CategoriesPageClient from "./CategoriesPageClient";

export default async function CategoriesPage() {
  const initialCategories = await fetchAllCategories();
  return <CategoriesPageClient initialCategories={initialCategories} />;
}
