import database from "../../public/data/database.json";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  available: boolean;
}

export interface Database {
  cartriges: Product[];
  pods: Product[];
  chaser: Product[];
  octobar: Product[];
  fl: Product[];
}

export function getProductById(id: string): Product | null {
  const db = database as Database;

  // Search in all categories
  const allProducts = [
    ...db.cartriges,
    ...db.pods,
    ...db.chaser,
    ...db.octobar,
    ...db.fl,
  ];

  return allProducts.find((product) => product.id === id) || null;
}

export function getProductsByCategory(
  category: keyof Database | "all"
): Product[] {
  const db = database as Database;
  if (category === "all") {
    return [...db.cartriges, ...db.pods, ...db.chaser, ...db.octobar, ...db.fl];
  }
  return db[category] || [];
}

export function getAllProducts(): Product[] {
  const db = database as Database;
  return [...db.cartriges, ...db.pods, ...db.chaser, ...db.octobar, ...db.fl];
}
