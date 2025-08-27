"use client";

import { popup } from "@telegram-apps/sdk";

interface PopupButton {
  id: string;
  type: "default" | "ok" | "close" | "destructive";
  text: string;
}

interface PopupOptions {
  title: string;
  message: string;
  buttons: PopupButton[];
}

/**
 * Хук для открытия Telegram popup
 * Кнопки типа { id: string; type: "default" | "ok" | "close" | "destructive"; text: string;}
 */
export function useTelegramPopup() {
  const openPopup = async ({ title, message, buttons }: PopupOptions) => {
    if (!popup.open.isAvailable()) {
      console.warn("Telegram popup is not available outside Mini Apps");
      return null;
    }

    try {
      const buttonId = await popup.open({
        title,
        message,
        buttons,
      });
      return buttonId; // id кнопки, на которую кликнул пользователь
    } catch (error) {
      console.error("Ошибка при открытии popup:", error);
      return null;
    }
  };

  return { openPopup };
}
