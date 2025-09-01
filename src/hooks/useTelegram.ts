import { backButton, initData, isTMA, User } from "@telegram-apps/sdk-react";
import { redirect, RedirectType, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useHapticFeedback } from "./useHapticFeedback";
import { LaunchParams, retrieveLaunchParams } from "@telegram-apps/sdk";

/**
 * Хук для получения пользовательских данных и isInTMA признака
 */

export function useTelegram() {
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [launchParams, setLaunchParams] = useState<LaunchParams | undefined>(
    undefined
  );

  const pathname = usePathname();
  const { impact } = useHapticFeedback();

  useEffect(() => {
    if (!isTMA()) return;

    // Инициализация данных пользователя
    initData.restore();
    setUserData(initData.user());
    setLaunchParams(retrieveLaunchParams());

    // Обработчик кнопки "Назад"
    const handleBackClick = () => {
      impact("light");
      redirect("/", RedirectType.replace);
    };

    // Настройка кнопки "Назад"
    if (pathname !== "/") {
      backButton.show();
      backButton.onClick(handleBackClick);
    }

    // Очистка при размонтировании
    return () => {
      backButton.offClick(handleBackClick);
      backButton.hide();
    };
  }, []);

  return {
    userData,
    isInTMA: isTMA(),
    launchParams,
  };
}
