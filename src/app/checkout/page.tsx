"use client";
import React from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { useTelegramPopup } from "../../hooks/useTelegramPopup";
import { openTelegramLink } from "@telegram-apps/sdk-react";

async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Падение → пробуем fallback
    }
  }

  // fallback через textarea
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function CheckoutPage() {
  const { userData } = useTelegram();
  const { openPopup } = useTelegramPopup();

  const handleCopy = async () => {
    if (!userData?.id) return;

    const success = await copyText(String(userData.id));
    if (success) {
      openPopup({
        title: "Успех!",
        message: "Текст скопирован!",
        buttons: [{ id: "ok", type: "default", text: "Ок" }],
      });
    } else {
      openPopup({
        title: "Ошибка",
        message: "Ошибка копирования, попробуйте вручную.",
        buttons: [{ id: "ok", type: "destructive", text: "Ок" }],
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen overflow-y-hidden pb-20">
        <div className="relative flex items-center justify-center w-[50px] h-[50px] rounded-full after:content-[''] after:w-[40px] after:h-[20px] after:border-[10px] after:border-solid after:border-blue-400 after:rounded-[15%] after:border-t-0 after:border-r-0 after:-rotate-45 after:opacity-0 after:animate-checkmark"></div>
        <div className="text-center w-4/5 flex items-center justify-center mt-7 text-gray-950 text-[20px]">
          Спасибо за заказ! <br /> <br />
          Чтобы завершить перейдите пожалуйста в чат с администратором и
          сообщите ему свой ID.
        </div>

        <div
          className="text-center flex flex-col items-center justify-center mt-5 text-[20px] font-bold text-gray-950 cursor-pointer"
          onClick={handleCopy}
        >
          ID: {userData?.id ?? "—"}
          <span className="text-[12px] font-normal text-gray-950">
            (кликните чтобы скопировать)
          </span>
        </div>
      </div>

      <button
        className="mx-auto bg-blue-400 text-gray-950 rounded-[10px] h-10 w-[calc(100%-20px)] text-[14px] leading-10 outline-none border-0 cursor-pointer fixed left-[10px] bottom-[var(--tg-safe-area-inset-bottom,24px)]"
        onClick={() =>
          openTelegramLink.ifAvailable("https://t.me/Liquid_Lounge")
        }
      >
        Чат с администратором
      </button>
    </>
  );
}
