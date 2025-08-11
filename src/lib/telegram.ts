// lib/telegram.ts
import { init } from "@telegram-apps/sdk";

export const isInitialized = { initialized: false };

export function initTelegram() {
  if (
    typeof window !== "undefined" &&
    "Telegram" in window &&
    window.Telegram.WebApp &&
    !isInitialized.initialized
  ) {
    init();
    isInitialized.initialized = true;
  }
}
