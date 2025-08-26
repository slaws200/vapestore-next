import { Product } from "@/types/product";
import { User } from "@telegram-apps/sdk-react";
import { OrderButton } from "./OrderButton";

interface ProductInfoProps {
  product: Product;
  userData: User | undefined;
}

export function ProductInfo({ product, userData }: ProductInfoProps) {
  return (
    <div className="md:w-2/3">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>

      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-bold text-blue-600">
          Цена ₽{product.price}
        </p>
        <OrderButton product={product} userData={userData} />
      </div>

      <div className="prose max-w-none">
        <h4 className="text-lg text-gray-700 font-semibold mb-2">Описание:</h4>
        <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}
