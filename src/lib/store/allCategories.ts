import { Category } from "@/types/category";
import { create } from "zustand";

type AllCategoriesStore = {
  allCategories: Category[];
  setAllCategories: (allCategories: Category[]) => void;
};

export const useAllCategoriesStore = create<AllCategoriesStore>((set) => ({
  allCategories: [],
  setAllCategories: (allCategories) => set({ allCategories: allCategories }),
}));
