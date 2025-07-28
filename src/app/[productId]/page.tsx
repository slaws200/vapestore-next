"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductById, Product } from "../lib/products";
import Link from "next/link";

export default function ProductPage() {
  const pathname = usePathname();
  const productId = pathname.split("/").pop();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError("Product not found");
      }
    } else {
      setError("No product ID provided");
    }
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-500">
            The requested product could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600">
          &larr; Back to home
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={`/${product.image}`}
                  alt={product.name}
                  className="object-contain"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={product.image}
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                ₽{product.price}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <span className="text-gray-600 w-25">В наличии:</span>
                  <span
                    className={`font-medium ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock}` : "Нет в наличии"}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-2">Описание:</h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add your checkout form here
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">₽{product.price}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₽{product.price}</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
