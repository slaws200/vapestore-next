"use client";

import { useTelegram } from "@/hooks/useTelegram";
import { useGlobalLoaderStore } from "@/lib/store/globalLoaderStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const { launchParams } = useTelegram();
  const platform = launchParams?.tgWebAppPlatform;
  const { setIsLoading } = useGlobalLoaderStore();
  const pathname = usePathname();
  const isProductCard =
    pathname === "/" || pathname === "/profile" || pathname === "/categories"
      ? true
      : false;

  const tabs = [
    { path: "/", label: "Главная", color: "blue" },
    // { path: "/categories", label: "Категории", color: "blue" },
    { path: "/profile", label: "Профиль", color: "blue" },
  ];

  const getTabClasses = (isActive: boolean, color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-600 text-white shadow-md",
      green: "bg-green-600 text-white shadow-md",
      red: "bg-red-600 text-white shadow-md",
    };

    return isActive
      ? `flex-1 text-center py-2 rounded-lg ${colorMap[color]}`
      : "flex-1 text-center py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200";
  };

  return (
    isProductCard && (
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t px-2 py-2 ${
          !platform || platform === "web" || platform === "tdesktop"
            ? "pb-2"
            : "pb-8"
        } flex gap-2 font-medium text-sm`}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              onClick={() => {
                !isActive && setIsLoading(true);
              }}
              key={tab.path}
              href={tab.path}
              className={`${getTabClasses(
                isActive,
                tab.color
              )} flex justify-center`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    )
  );
}
