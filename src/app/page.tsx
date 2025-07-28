import SearchInput from "./components/SearchInput";
import ProductListWithCategories from "./components/ProductListWithCategories";

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <div className="mx-auto px-4">
        <SearchInput className="mb-4" />
        <ProductListWithCategories />
      </div>
    </main>
  );
}
