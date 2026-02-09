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
  private static readonly ORDER_WEBHOOK_PATH = "/api/order";

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
      const response = await fetch(this.ORDER_WEBHOOK_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      const data = (await response.json()) as OrderResponse;

      if (!response.ok) {
        return {
          success: false,
          message: data.message ?? "Произошла ошибка при оформлении заказа",
        };
      }

      return {
        success: data.success ?? true,
        message: data.message,
      };
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
