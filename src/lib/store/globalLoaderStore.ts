import { create } from "zustand";

type GlobalLoaderStore = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useGlobalLoaderStore = create<GlobalLoaderStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
}));
