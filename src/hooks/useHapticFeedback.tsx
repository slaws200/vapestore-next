"use client";

import { hapticFeedback } from "@telegram-apps/sdk";

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

/**
 * Хук для использования Haptic Feedback
 */
export function useHapticFeedback() {
  const impact = (style: ImpactStyle) => {
    if (!hapticFeedback.impactOccurred.isAvailable()) {
      console.warn(
        "Haptic feedback is not available outside Telegram Mini Apps"
      );
      return;
    }

    try {
      hapticFeedback.impactOccurred(style);
    } catch (error) {
      console.error("Ошибка при вызове haptic feedback:", error);
    }
  };

  return { impact };
}
