import { fetchProductById } from "@/lib/products";
import NotFound from "../not-found";
import ProductDetailCard from "@/components/productComponents/ProductDetailCard";
import { Product } from "../../types/product";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

// UUID validation function
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  // Check if productId is a valid UUID before fetching
  if (!isValidUUID(productId)) {
    return <NotFound />;
  }

  const product: Product | null = await fetchProductById(productId);

  if (!product) {
    return <NotFound />;
  }

  return <ProductDetailCard product={product} />;
}
