"use client";
import { useGlobalLoaderStore } from "@/lib/store/globalLoaderStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function GlobalLoader() {
  const pathname = usePathname();
  const { isLoading, setIsLoading } = useGlobalLoaderStore();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
}
