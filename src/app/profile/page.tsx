"use client";

import Image from "next/image";
import { useTelegram } from "../../hooks/useTelegram";
import Accordion from "../../components/ui/Accordion";
import Select from "../../components/ui/Select";
import { fetchAllCategories } from "../../lib/categories";
import { useState, useEffect } from "react";
import { Category } from "../../types/category";
import { categoryNamesRu } from "../../utils/constants";

export default function ProfilePage() {
  const { userData } = useTelegram();
  const [categories, setCategories] = useState<Category[] | undefined>();

  useEffect(() => {
    fetchAllCategories()
      .then((data) => setCategories(data))
      .catch(() => console.error("Ошибка при загрузке категорий"));
  }, []);

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
    <div className="flex flex-col gap-4 overflow-auto min-h-screen">
      {/* Блок с профилем */}
      <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
        <Image
          className="rounded-full relative top-7 border-2 border-gray-300"
          src={userData.photo_url!}
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

      {/* Категории */}
      <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
        <div className="flex flex-col items-center text-lg w-full rounded-xl bg-white">
          <span className="w-full flex justify-between items-center font-medium text-gray-900 p-4">
            Добавить товар в категорию:
          </span>
          <Select
            placeholder="Выбери категорию..."
            options={generateOptions(categories)}
          />
        </div>
      </div>

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
            <a
              className="text-sm text-blue-600"
              href="https://t.me/Liquid_Lounge"
            >
              Открыть
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
