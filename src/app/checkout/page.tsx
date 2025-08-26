"use client";
import React from "react";

export default function CheckoutPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen overflow-y-hidden pb-20">
        <div className="relative flex items-center justify-center w-[50px] h-[50px] rounded-full after:content-[''] after:w-[40px] after:h-[20px] after:border-[10px] after:border-solid after:border-blue-400 after:rounded-[15%] after:border-t-0 after:border-r-0 after:-rotate-45 after:opacity-0 after:animate-checkmark"></div>
        <div className="text-center w-4/5 flex items-center justify-center mt-7 text-white text-[20px]">
          Спасибо за заказ! <br /> <br />
          Чтобы завершить перейдите пожалуйста в чат с администратором и
          сообщите ему свой ID.
        </div>
        <div
          className="text-center flex flex-col items-center justify-center mt-5 text-[20px] font-bold text-[var(--tg-theme-accent-text-color)]"
          // onClick={() => {
          //   navigator.clipboard
          //     .writeText(`${window.Telegram.WebApp.initDataUnsafe.user?.id}`)
          //     .then(() => {
          //       window.Telegram.WebApp.showAlert("Текст скопирован!");
          //     })
          //     .catch((err) => {
          //       window.Telegram.WebApp.showAlert(
          //         "Ошибка копирования, попробуйте вручную."
          //       );
          //     });
          // }}
        >
          {/* ID: {window.Telegram.WebApp.initDataUnsafe.user?.id}{" "} */}
          <span className="text-[12px] font-normal text-[var(--tg-theme-hint-color)]">
            (кликните чтобы скопировать)
          </span>
        </div>
      </div>
      <button
        className="mx-auto bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-[10px] h-10 w-[calc(100%-20px)] text-[14px] leading-10 outline-none border-0 cursor-pointer fixed left-[10px] bottom-[var(--tg-safe-area-inset-bottom,24px)]"
        // onClick={handleClick}
      >
        Чат с администратором
      </button>
    </>
  );
}

// const OrderCreated: React.FC<OrderCreatedProps> = () => {
//   const handleClick = () => {
//     window.Telegram.WebApp.openTelegramLink("https://t.me/Liquid_Lounge");
//   };

//   return (

//   );
// };
