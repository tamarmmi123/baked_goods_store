export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  size_id?: string | null;
  type_id?: string | null;
  quantity: number;
}

export interface Cart {
  id: string;
  user_id: string;
  status: "active" | "completed";
  items: CartItem[];
  created_at: string;
  updated_at: string;
}