import { backButton, isTMA } from "@telegram-apps/sdk-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useHapticFeedback } from "./useHapticFeedback";
import { useGlobalLoaderStore } from "@/lib/store/globalLoaderStore";

export const useBackButton = (handleBackClick: () => void) => {
  const pathname = usePathname();
  const { impact } = useHapticFeedback();
  const { setIsLoading } = useGlobalLoaderStore();

  // Обработчик кнопки "Назад"
  const onBackClick = () => {
    setIsLoading(true);
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
