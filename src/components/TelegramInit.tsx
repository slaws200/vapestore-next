"use client";

import { backButton, init, isTMA } from "@telegram-apps/sdk";
import { postEvent } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export default function TelegramInit() {
  useEffect(() => {
    if (!isTMA()) {
      console.log("Not running inside Telegram Mini App, skipping backButton");
      return;
    }

    init();
    backButton.mount();

    // Пример — выключаем свайпы
    postEvent("web_app_setup_swipe_behavior", {
      allow_vertical_swipe: false,
    });
  }, []);

  return null;
}
