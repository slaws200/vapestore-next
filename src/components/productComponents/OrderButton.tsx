import { Product } from "@/types/product";
import { User } from "@telegram-apps/sdk-react";
import { useState } from "react";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useTelegramPopup } from "@/hooks/useTelegramPopup";
import { OrderService } from "@/lib/OrderService";
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
        console.log("Пользователь отменил ❌");
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
        await openPopup({
          title: "",
          message: orderResult.message || "Заказ успешно оформлен!",
          buttons: [{ id: "ok", type: "ok", text: "Ок" }],
        });
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
      className={`bg-sky-400 hover:bg-sky-500 disabled:bg-gray-400 text-white text-lg rounded-md h-7 w-21 transition-colors duration-200 ${className}`}
    >
      {"Заказать"}
    </button>
  );
}
