import { create } from "zustand";

type CategoryStore = {
  activeCategory: string | "all";
  setActiveCategory: (category: string | "all") => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  activeCategory: "all",
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
