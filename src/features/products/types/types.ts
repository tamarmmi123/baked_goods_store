export interface ProductSize {
  id: string;
  label: string;
  price: number;
  qty: number;
}

export interface ProductType {
  id: string;
  typeLabel: string;
  imageUrl: string;
  description: string;
}

export interface Product {
  id: string;
  productname: string;
  qty: number;
  kashrut: "milky" | "parev" | "meaty";
  specialrequirements: string[];
  occasions: string[];
  category: string;
  isActive: boolean;
  sizes: ProductSize[];
  types: ProductType[];
}