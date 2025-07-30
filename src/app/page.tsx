import SearchInput from "@/components/SearchInput";
import ProductListWithCategories from "@/components/productComponents/ProductListWithCategories";

export default function Home() {
  return (
    <main className="min-h-screen overflow-y-hidden">
      <div className="mx-auto px-4">
        <SearchInput />
        <ProductListWithCategories />
      </div>
    </main>
  );
}
