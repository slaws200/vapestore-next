import Link from "next/link";
import EditForm from "../../../components/EditForm";

export default async function CreateProductByCategoryPage(props: unknown) {
  const { categoryId } = await (props as { params: { categoryId: string } })
    .params;
  return (
    <div>
      <Link href="/" className="text-blue-600">
        &larr; Вернуться на главную
      </Link>
      <EditForm categoryId={categoryId} />
    </div>
  );
}
