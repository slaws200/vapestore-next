export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  description?: string; // Описание может быть необязательным
  stock?: number;
  available: boolean;
  category_id: string;
};
