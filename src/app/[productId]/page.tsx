import { getProductById, Product } from "@/lib/products";
import NotFound from "../not-found";
import ProductDetailCard from "@/components/productComponents/ProductDetailCard";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product: Product | null = getProductById(productId);

  if (!product) {
    return <NotFound />;
  }

  return <ProductDetailCard product={product} />;
}
