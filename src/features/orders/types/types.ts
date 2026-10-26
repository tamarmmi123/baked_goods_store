export type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_size_id: string;
  product_type_id: string | null;
  product_name: string;
  size_label: string;
  type_label: string | null;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface Order {
  id: string;
  user_id: string;
  cart_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  full_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  shipping_city: string;
  postal_code: string;
  subtotal: string;
  delivery_fee: string;
  total: string;
  created_at: string;
  item_count?: number;
  items?: OrderItem[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: Order;
}

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus | "";
  search?: string;
}

export interface ProductionSummaryItem {
  product_id: string;
  product_name: string;
  product_size_id: string;
  size_label: string;
  product_type_id: string | null;
  type_label: string | null;
  quantity_to_make: number;
  order_count: number;
}