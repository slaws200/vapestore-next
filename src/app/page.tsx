// import SearchInput from "@/components/SearchInput";
import ProductListWithCategories from "@/components/productComponents/ProductListWithCategories";
import { fetchAllCategories } from "@/lib/categories";
import { fetchAllProducts } from "@/lib/products";

export default async function Home() {
  const initialProducts = await fetchAllProducts(0, 11);
  const initialCategories = await fetchAllCategories();
  return (
    <main className="overflow-y-hidden scrollbar-hide">
      <div className="mx-auto px-4">
        <ProductListWithCategories
          preloadedData={initialProducts}
          startOffset={[0, 11]}
          preloadedCategories={initialCategories}
        />
      </div>
    </main>
  );
}
