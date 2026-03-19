// Profile admin page: categories list + active toggle via Telegram popup
"use client";

import Loader from "@/components/loader";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useBackButton } from "@/hooks/useBackButton";
import { useTelegram } from "@/hooks/useTelegram";
import { useTelegramPopup } from "@/hooks/useTelegramPopup";
import {
  addCategory,
  fetchAllCategories,
  updateCategoryActive,
} from "@/lib/categories";
import { useAllCategoriesStore } from "@/lib/store/allCategories";
import { Category } from "@/types/category";
import { adminsIds, categoryNamesRu } from "@/utils/constants";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { redirect, RedirectType } from "next/navigation";

function ActiveSwitch({
  checked,
  disabled,
  onToggle,
}: {
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      className={[
        "w-20 h-10 rounded-full relative transition-colors duration-300 ease-in-out",
        checked ? "bg-blue-500" : "bg-gray-300",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 left-0.5 w-9 h-9 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out",
          checked ? "translate-x-10" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

export default function CategoriesAdminPage() {
  const { userData } = useTelegram();
  const { openPopup } = useTelegramPopup();
  const { impact } = useHapticFeedback();

  const { setAllCategories, allCategories } = useAllCategoriesStore();

  useBackButton(() => redirect("/profile", RedirectType.replace));

  const isAdmin = useMemo(() => {
    if (!userData) return false;
    return adminsIds.includes(userData.id);
  }, [userData]);

  useEffect(() => {
    if (!isAdmin) return;
    if (allCategories.length) return;

    fetchAllCategories()
      .then((res) => setAllCategories(res))
      .catch((e) => console.error("fetchAllCategories error:", e));
  }, [isAdmin, allCategories.length, setAllCategories]);

  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingCategoryId, setUpdatingCategoryId] = useState<string | null>(
    null
  );

  const fallbackImage = allCategories[0]?.image;

  const handleToggleActive = async (category: Category) => {
    if (!userData || !isAdmin) return;
    if (updatingCategoryId === category.id) return;

    const nextActive = !category.active;
    const categoryLabel = categoryNamesRu[category.name] ?? category.name;

    const confirmRes = await openPopup({
      title: "Подтверждение",
      message: `Категория "${categoryLabel}" будет ${
        nextActive ? "активна" : "скрыта"
      }. Продолжить?`,
      buttons: [
        { id: "ok", type: "ok", text: "Да" },
        { id: "cancel", type: "destructive", text: "Отмена" },
      ],
    });

    if (confirmRes !== "ok") {
      impact("heavy");
      return;
    }

    setUpdatingCategoryId(category.id);
    try {
      await updateCategoryActive(category.id, nextActive);
      const refreshed = await fetchAllCategories();
      setAllCategories(refreshed);
      impact("rigid");
    } catch (e) {
      console.error(e);
      await openPopup({
        title: "Ошибка",
        message: "Не удалось обновить категорию.",
        buttons: [{ id: "ok", type: "destructive", text: "Закрыть" }],
      });
      impact("heavy");
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!userData || !isAdmin) return;

    const trimmedName = newName.trim();
    if (!trimmedName) {
      await openPopup({
        title: "Проверьте данные",
        message: "Имя категории не может быть пустым.",
        buttons: [{ id: "ok", type: "close", text: "Понял" }],
      });
      impact("heavy");
      return;
    }

    setIsAdding(true);
    try {
      await addCategory({
        name: trimmedName,
        active: newActive,
        image: fallbackImage,
      });

      const refreshed = await fetchAllCategories();
      setAllCategories(refreshed);

      setNewName("");
      setNewActive(true);

      impact("rigid");
      await openPopup({
        title: "Успех",
        message: "Категория добавлена.",
        buttons: [{ id: "ok", type: "close", text: "Закрыть" }],
      });
    } catch (e) {
      console.error(e);
      await openPopup({
        title: "Ошибка",
        message: "Не удалось добавить категорию. Попробуйте позже.",
        buttons: [{ id: "error", type: "destructive", text: "Закрыть" }],
      });
      impact("heavy");
    } finally {
      setIsAdding(false);
    }
  };

  if (!userData) return <div>Нет данных</div>;

  return (
    <div className="flex flex-col gap-4 min-h-screen pb-20 bg-scroll overflow-y-auto">
      <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
        <div className="flex flex-col items-center text-lg w-full rounded-xl bg-white p-4 pt-7">
          <span className="font-bold">Категории</span>
          <span className="font-light text-sm text-center text-gray-600 mt-2">
            Управляйте видимостью категорий (`active`) и добавляйте новые.
          </span>
        </div>
      </div>

      {!isAdmin ? (
        <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
          <div className="flex flex-col items-center text-lg w-full rounded-xl bg-white p-4 pt-7">
            <span className="font-bold">Нет доступа</span>
            <span className="font-light text-sm text-center text-gray-600 mt-2">
              Вы не администратор.
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Add category */}
          <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
            <div className="flex flex-col items-center text-lg w-full min-h-30 rounded-xl bg-white px-4 py-4">
              <form
                onSubmit={handleAddCategory}
                className="flex flex-col gap-4 w-full"
              >
                <div className="flex items-center justify-between gap-4">
                  <label className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-medium text-gray-900">
                      Имя категории
                    </span>
                    <input
                      value={newName}
                      onChange={(ev) => setNewName(ev.target.value)}
                      className="border border-gray-300 p-2 w-full bg-white rounded-sm outline-none"
                      placeholder="Например, pods"
                    />
                  </label>

                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <span className="text-xs font-medium text-gray-900">
                      Статус активности
                    </span>
                    <ActiveSwitch
                      checked={newActive}
                      disabled={isAdding}
                      onToggle={() => setNewActive((v) => !v)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="bg-blue-600 text-white rounded-lg h-10 w-full disabled:opacity-50"
                >
                  {isAdding ? (
                    <Loader className="h-3 w-3 mx-auto" />
                  ) : (
                    "Добавить"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Categories list */}
          <div className="text-gray-950 flex flex-col items-center justify-center relative px-4">
            <div className="flex flex-col items-center text-lg w-full min-h-30 rounded-xl bg-white px-4 py-4">
              <div className="w-full flex items-center justify-between mb-3">
                <span className="text-gray-900 font-bold text-sm">
                  Все категории
                </span>
                {allCategories.length ? null : <Loader className="h-3 w-3" />}
              </div>

              {!allCategories.length ? (
                <div className="text-sm text-gray-600 py-6">
                  Категории не загружены.
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  {allCategories.map((cat) => {
                    const isUpdating = updatingCategoryId === cat.id;
                    const label = categoryNamesRu[cat.name] ?? cat.name;

                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between gap-4 border border-gray-100 rounded-lg p-3"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {label}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate">
                            id: {cat.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {isUpdating ? (
                            <Loader className="h-3 w-3" />
                          ) : (
                            <ActiveSwitch
                              checked={cat.active}
                              disabled={isUpdating}
                              onToggle={() => handleToggleActive(cat)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
