import CreateProduct from "./CreateProduct";

export default async function CreateProductByCategoryPage(props: unknown) {
  const { categoryId } = await (props as { params: { categoryId: string } })
    .params;
  return <CreateProduct categoryId={categoryId} />;
}
