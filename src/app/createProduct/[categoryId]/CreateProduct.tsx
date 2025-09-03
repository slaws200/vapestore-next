"use client";
import { useBackButton } from "@/hooks/useBackButton";
import EditForm from "../../../components/EditForm";
import { redirect, RedirectType } from "next/navigation";

export default function CreateProduct({ categoryId }: { categoryId: string }) {
  useBackButton(() => redirect("/profile", RedirectType.replace));
  return <EditForm categoryId={categoryId} />;
}
