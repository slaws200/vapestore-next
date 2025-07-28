import SearchInput from "./components/SearchInput";
import ProductListWithCategories from "./components/ProductListWithCategories";

export default function Home() {
  return (
    <main className="min-h-screen overflow-y-hidden">
      <div className="mx-auto px-4">
        <SearchInput className="mb-8" />
        <ProductListWithCategories />
      </div>
    </main>
  );
}
