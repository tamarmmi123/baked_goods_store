export interface Product {
  id: string;
  productname: string;
  description: string;
  price: number;
  imageUrl: string;
  qty?: number;
  kashrut: "milk" | "parav" | "meat";
  specialRequirements?: string[];
  occasions?: string[];
}