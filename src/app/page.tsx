import SearchInput from "./components/SearchInput";
import ProductListWithCategories from "./components/ProductListWithCategories";

export default function Home() {
  return (
    <main className="min-h-screen pb-16 top-10 bottom-10 overflow-y-hidden">
      <div className="mx-auto px-4">
        <SearchInput className="mb-8" />
        <ProductListWithCategories />
      </div>
    </main>
  );
}
