export interface CustomerProfile {
  id: string;
  username: string;
  email: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
  };
}

export interface CheckoutRequest {
  cartId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  id: string;
  order_id?: string;
  product_id: string;
  product_size_id: string;
  product_type_id: string | null;
  product_name: string;
  size_label: string;
  type_label: string | null;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
}

export interface Order {
  id: string;
  user_id?: string;
  cart_id?: string;
  status: string;
  payment_status: string;
  full_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  shipping_city: string;
  postal_code: string;
  subtotal: string | number;
  delivery_fee: string | number;
  total: string | number;
  created_at: string;
  items: OrderItem[];
}
