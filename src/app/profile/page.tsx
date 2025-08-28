// pages/ProfilePage.tsx
"use client";

import Image from "next/image";
import { useTelegram } from "../../hooks/useTelegram";

export default function ProfilePage() {
  const { userData } = useTelegram();

  if (!userData) return <div>Нет данных</div>;

  return (
    <div className="text-amber-950 flex flex-col items-center justify-center relative">
      <Image
        className="rounded-full relative top-7 border-2 border-gray-300"
        src={userData.photo_url!}
        alt="user"
        width={60}
        height={60}
      />
      <div
        className={`flex flex-col items-center font-bold text-lg w-70 min-h-30 rounded-xl bg-white p-4 pt-7`}
      >
        <span>
          {userData.first_name} {userData.last_name}
        </span>
        <span className="font-light text-sm text-center">
          Раздел профиля находится в разработке.
          <br /> Следите за обновлениями!
        </span>
      </div>
    </div>
  );
}
