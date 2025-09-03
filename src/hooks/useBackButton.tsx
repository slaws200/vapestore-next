import { backButton, isTMA } from "@telegram-apps/sdk-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useHapticFeedback } from "./useHapticFeedback";

export const useBackButton = (handleBackClick: () => void) => {
  const pathname = usePathname();
  const { impact } = useHapticFeedback();

  // Обработчик кнопки "Назад"
  const onBackClick = () => {
    impact("light");
    handleBackClick();
  };

  useEffect(() => {
    if (!isTMA()) return;
    // Настройка кнопки "Назад"
    if (pathname !== "/") {
      backButton.show();
      backButton.onClick(onBackClick);
    }

    // Очистка при размонтировании
    return () => {
      backButton.offClick(onBackClick);
      backButton.hide();
    };
  }, []);

  return null;
};
