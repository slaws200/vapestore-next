"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProductDetailCard({ product }: { product: Product }) {
  const orderHandler = async () => {
    if (!product) {
      console.error("Продукт отсутствует, запрос не будет отправлен.");
      return;
    }

    const reqBody = {
      ...product,
      id: 7777,
      username: "@battlegear",
    };

    try {
      const response = await fetch(
        "https://mybot-pmod.onrender.com/sendHello",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(reqBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Ответ от сервера:", data);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };
  return (
    <div className="max-h-[100vh] overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl mx-auto p-4">
        <Link
          href="/"
          className="font-bold text-white bg-sky-400 rounded-md w-fit p-2"
        >
          &larr; Вернуться на главную
        </Link>

        <div className="rounded-lg p-6 mb-6">
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
                      product.stock! > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock! > 0 ? `${product.stock}` : "Нет в наличии"}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h4 className="text-lg text-gray-700 font-semibold mb-2">
                  Описание:
                </h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
              <button
                onClick={orderHandler}
                className="bg-sky-400 text-white px-4 py-2 rounded-md"
              >
                Заказать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
