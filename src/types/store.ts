import { ClothingCategory } from "./index";

export interface StoreProduct {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  createdAt: string;
}
