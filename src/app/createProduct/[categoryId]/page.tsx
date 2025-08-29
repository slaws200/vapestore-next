import Link from "next/link";
import EditForm from "../../../components/EditForm";

export default function CreateProductByCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const { categoryId } = params;
  return (
    <div>
      <Link href="/" className="text-blue-600">
        &larr; Вернуться на главную
      </Link>
      <EditForm categoryId={categoryId} />
    </div>
  );
}
