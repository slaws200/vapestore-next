"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { backButton } from "@telegram-apps/sdk-react";
import { isTMA } from "@telegram-apps/sdk";

export default function TelegramBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isTMA()) return;

    const handleClick = () => {
      router.back(); // или redirect("/", RedirectType.replace);
    };

    // показать кнопку
    if (
      pathname.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      backButton.show();
    }

    // подписаться на клик
    backButton.onClick(handleClick);

    // очистка
    return () => {
      backButton.offClick(handleClick);
      backButton.hide();
    };
  }, [router]);

  return null;
}
