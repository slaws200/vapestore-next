import { LaunchParams, retrieveLaunchParams } from "@telegram-apps/sdk";
import { initData, isTMA, User } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

/**
 * Хук для получения пользовательских данных и isInTMA признака
 */

export function useTelegram() {
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [launchParams, setLaunchParams] = useState<LaunchParams | undefined>(
    undefined
  );

  useEffect(() => {
    if (!isTMA()) return;

    // Инициализация данных пользователя
    initData.restore();
    setUserData(initData.user());
    setLaunchParams(retrieveLaunchParams());
  }, []);

  return {
    userData,
    isInTMA: isTMA(),
    launchParams,
  };
}
