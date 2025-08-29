import Image from "next/image";
import { Product } from "@/types/product";

interface ProductImageProps {
  product: Product;
  className?: string;
}

export function ProductImage({ product, className = "" }: ProductImageProps) {
  return (
    <div
      className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ${className}`}
    >
      <Image
        src={
          product.image.startsWith("http") ? product.image : `/${product.image}`
        }
        alt={product.name}
        className={`object-contain ${
          !product.available ? "grayscale-100" : ""
        }`}
        fill
        loading="lazy"
        placeholder="blur"
        blurDataURL={product.image || "img/xros4.webp"}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
