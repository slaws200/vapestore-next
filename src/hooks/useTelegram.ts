import { backButton, initData, isTMA, User } from "@telegram-apps/sdk-react";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";
import { useHapticFeedback } from "./useHapticFeedback";

export function useTelegram() {
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const { impact } = useHapticFeedback();

  useEffect(() => {
    if (!isTMA()) return;

    // Инициализация данных пользователя
    initData.restore();
    setUserData(initData.user());

    // Обработчик кнопки "Назад"
    const handleBackClick = () => {
      impact("light");
      redirect("/", RedirectType.replace);
    };

    // Настройка кнопки "Назад"
    backButton.show();
    backButton.onClick(handleBackClick);

    // Очистка при размонтировании
    return () => {
      backButton.offClick(handleBackClick);
      backButton.hide();
    };
  }, []);

  return {
    userData,
    isInTMA: isTMA(),
  };
}
