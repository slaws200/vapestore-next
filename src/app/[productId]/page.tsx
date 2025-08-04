import { fetchProductById } from "@/lib/products";
import NotFound from "../not-found";
import ProductDetailCard from "@/components/productComponents/ProductDetailCard";
import { Product } from "../../types/product";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product: Product | null = await fetchProductById(productId);

  if (!product) {
    return <NotFound />;
  }

  return <ProductDetailCard product={product} />;
}
