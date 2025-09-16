"use client";

import { useBackButton } from "@/hooks/useBackButton";
import { useAllCategoriesStore } from "@/lib/store/allCategories";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import Accordion from "../../components/ui/Accordion";
import Select from "../../components/ui/Select";
import { useTelegram } from "../../hooks/useTelegram";
import { Category } from "../../types/category";
import { adminsIds, categoryNamesRu } from "../../utils/constants";

export default function ProfilePage() {
  const { userData } = useTelegram();
  const { allCategories } = useAllCategoriesStore();
  useBackButton(() => redirect("/", RedirectType.replace));

  if (!userData) return <div>Нет данных</div>;

  const generateOptions = (categories?: Category[]) => {
    if (!categories) {
      return [{ label: "Ошибка при загрузке", value: "Error" }];
    }
    return categories.map((item) => ({
      label: categoryNamesRu[item.name] ?? item.name,
      value: item.id,
    }));
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen pb-20 bg-scroll overflow-y-auto">
      {/* Блок с профилем */}
      <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
        <Image
          className="rounded-full relative top-7 border-2 border-gray-300"
          src={userData?.photo_url ?? ""}
          alt="user"
          width={60}
          height={60}
        />
        <div className="flex flex-col items-center text-lg w-full min-h-30 rounded-xl bg-white p-4 pt-7">
          <span className="font-bold">
            {userData.first_name} {userData.last_name}
          </span>
          <span className="font-light text-sm text-center">
            Раздел профиля находится в разработке.
            <br /> Следите за обновлениями!
          </span>
        </div>
      </div>

      {/* Добавление новых товаров */}
      {adminsIds.includes(userData.id) && (
        <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
          <div className="flex flex-col items-center text-lg w-full rounded-xl bg-white">
            <span className="w-full flex justify-between items-center font-medium text-gray-900 p-4">
              Добавить товар в категорию:
            </span>
            <Select
              placeholder="Выбери категорию..."
              options={generateOptions(allCategories)}
            />
          </div>
        </div>
      )}

      {/* Accordion */}
      <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
        <div className="flex flex-col items-center text-lg w-full min-h-30 rounded-xl bg-white px-4">
          <Accordion />
        </div>
      </div>

      {/* Контакты */}
      <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
        <div className="flex flex-col items-center text-lg text-left w-full min-h-10 rounded-xl bg-white p-4">
          <span className="w-full flex justify-between items-center font-medium text-gray-900">
            Связаться с админом:
            <button
              onClick={() =>
                openTelegramLink.ifAvailable("https://t.me/Liquid_Lounge")
              }
              className="text-sm text-blue-600"
            >
              Открыть
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
