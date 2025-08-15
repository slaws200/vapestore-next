// components/TelegramInit.tsx
"use client";

import { useEffect } from "react";
import { initTelegram } from "@/lib/telegram";
import { postEvent } from "@telegram-apps/sdk-react";

export default function TelegramInit() {
  useEffect(() => {
    initTelegram();
    postEvent("web_app_request_fullscreen");
    postEvent("web_app_setup_swipe_behavior", {
      allow_vertical_swipe: false,
    });
  }, []);

  return null;
}
