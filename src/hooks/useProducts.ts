// hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  fetchProductsByCategoryId,
  updateProduct,
} from "@/lib/products";
import { Product } from "@/types/product";
import { v4 as uuidv4 } from "uuid";

// Получить продукты по категории
export function useProductsByCategory(categoryId: string | "all") {
  return useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: () => fetchProductsByCategoryId(categoryId),
    enabled: categoryId !== "all",
    staleTime: 5 * 60 * 1000, // 5 мин
  });
}

// Добавить продукт (с оптимистичным апдейтом)
export function useAddProduct(categoryId: string | "all") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, "id">) => addProduct(product),
    onMutate: async (newProduct) => {
      if (categoryId === "all") return; // оптимизм только для категорий
      await queryClient.cancelQueries({
        queryKey: ["products", "category", categoryId],
      });

      const prevProducts = queryClient.getQueryData<Product[]>([
        "products",
        "category",
        categoryId,
      ]);

      // создаём временный продукт
      const optimisticProduct: Product = {
        id: uuidv4(),
        ...newProduct,
      };

      queryClient.setQueryData<Product[]>(
        ["products", "category", categoryId],
        (old = []) => [...old, optimisticProduct]
      );

      return { prevProducts };
    },
    onError: (err, newProduct, context) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(
          ["products", "category", categoryId],
          [...context.prevProducts, newProduct]
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", "category", categoryId],
      });
    },
  });
}

// Обновить продукт (с оптимистичным апдейтом)
export function useUpdateProduct(categoryId: string | "all") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      updateProduct(id, product),
    onMutate: async ({ id, product }) => {
      if (categoryId === "all") return;
      await queryClient.cancelQueries({
        queryKey: ["products", "category", categoryId],
      });

      const prevProducts = queryClient.getQueryData<Product[]>([
        "products",
        "category",
        categoryId,
      ]);

      queryClient.setQueryData<Product[]>(
        ["products", "category", categoryId],
        (old = []) =>
          old ? old.map((p) => (p.id === id ? { ...p, ...product } : p)) : []
      );

      return { prevProducts };
    },
    onError: (err, _, context) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(
          ["products", "category", categoryId],
          context.prevProducts
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", "category", categoryId],
      });
    },
  });
}
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    // теперь в мутацию передаём целый продукт
    mutationFn: (product: Product) => deleteProduct(product.id),

    onMutate: async (product) => {
      await queryClient.cancelQueries({
        queryKey: ["products", "category", product.category_id],
      });

      const prevProducts = queryClient.getQueryData<Product[]>([
        "products",
        "category",
        product.category_id,
      ]);

      queryClient.setQueryData<Product[]>(
        ["products", "category", product.category_id],
        (old = []) => old.filter((p) => p.id !== product.id)
      );

      return { prevProducts, categoryId: product.category_id };
    },

    onError: (err, product, context) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(
          ["products", "category", context.categoryId],
          context.prevProducts
        );
      }
    },

    onSettled: (product, _err, _variables, context) => {
      if (context?.categoryId) {
        queryClient.invalidateQueries({
          queryKey: ["products", "category", context.categoryId],
        });
      }
    },
  });
}
