import { Product } from "@/types/product";
import { User } from "@telegram-apps/sdk-react";

export interface OrderRequest {
  product: Product;
  user: User | undefined;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
}

export class OrderService {
  private static readonly API_URL = "https://mybot-pmod.onrender.com/sendHello";

  static async createOrder({
    product,
    user,
  }: OrderRequest): Promise<OrderResponse> {
    if (!product) {
      console.error("Продукт отсутствует, запрос не будет отправлен.");
      return { success: false, message: "Продукт не найден" };
    }

    const reqBody = this.buildRequestBody(product, user);

    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      return { success: true, message: "Заказ успешно оформлен!" };
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      return {
        success: false,
        message: "Произошла ошибка при оформлении заказа",
      };
    }
  }

  private static buildRequestBody(product: Product, user: User | undefined) {
    return user
      ? {
          ...product,
          id: user.id,
          username: user.username,
        }
      : {
          ...product,
          id: "ошибка",
          username: "ошибка",
        };
  }
}
