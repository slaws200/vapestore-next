import Link from "next/link";
import EditForm from "../../../components/EditForm";

type PageProps = {
  params: { categoryId: string };
};

export default async function CreateProductByCategoryPage({
  params,
}: PageProps) {
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
