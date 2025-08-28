import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useTelegramPopup } from "@/hooks/useTelegramPopup";
import { OrderService } from "@/lib/OrderService";
import { Product } from "@/types/product";
import { User } from "@telegram-apps/sdk-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Loader from "../loader";

interface OrderButtonProps {
  product: Product;
  userData: User | undefined;
  className?: string;
}

export function OrderButton({
  product,
  userData,
  className = "",
}: OrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { openPopup } = useTelegramPopup();
  const { impact } = useHapticFeedback();

  const handleOrder = async () => {
    try {
      setIsLoading(true);

      // Подтверждение заказа
      const confirmResult = await openPopup({
        title: "Подтверждение",
        message: "Вы уверены, что хотите продолжить?",
        buttons: [
          { id: "ok", type: "ok", text: "Да" },
          { id: "cancel", type: "destructive", text: "Отмена" },
        ],
      });

      if (confirmResult !== "ok") {
        impact("heavy");
        return;
      }

      impact("rigid");

      // Создание заказа
      const orderResult = await OrderService.createOrder({
        product,
        user: userData,
      });

      // Показываем результат
      if (orderResult.success) {
        redirect("/checkout");
      } else {
        await openPopup({
          title: "Ошибка",
          message:
            orderResult.message || "Произошла ошибка при оформлении заказа",
          buttons: [{ id: "ok", type: "ok", text: "Ок" }],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loader className="h-3 w-3" />
  ) : (
    <button
      onClick={handleOrder}
      className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 ${className}`}
    >
      {"Заказать"}
    </button>
  );
}
