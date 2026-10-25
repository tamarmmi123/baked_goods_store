import { Link, useParams } from "react-router-dom";
import { useGetAdminOrderQuery } from "../api/ordersApi";

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetAdminOrderQuery(orderId!, {
    skip: !orderId,
  });

  if (isLoading) {
    return <div className="p-6">Loading order details...</div>;
  }

  if (isError || !order) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Failed to load order details.
        </p>
        <Link to="/orders" className="text-primary underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const formatPrice = (price: string | number) =>
    `₪${Number(price).toFixed(2)}`;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-sm text-gray-500 break-all">
            Order ID: {order.id}
          </p>
        </div>

        <Link
          to="/orders"
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          Back to orders
        </Link>
      </div>

      <section className="rounded-lg border p-5 space-y-3">
        <h2 className="text-lg font-semibold">Order Information</h2>

        <p>
          <strong>Order date:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Order status:</strong> {order.status}
        </p>
        <p>
          <strong>Payment status:</strong> {order.payment_status}
        </p>
      </section>

      <section className="rounded-lg border p-5 space-y-3">
        <h2 className="text-lg font-semibold">Customer Information</h2>

        <p><strong>Name:</strong> {order.full_name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p>
          <strong>Address:</strong>{" "}
          {order.shipping_address}, {order.shipping_city},{" "}
          {order.postal_code}
        </p>
      </section>

      <section className="rounded-lg border p-5">
        <h2 className="text-lg font-semibold mb-4">Ordered Products</h2>

        {!order.items?.length ? (
          <p className="text-gray-500">No order items found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 pr-4">Product</th>
                  <th className="py-3 pr-4">Size</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Quantity</th>
                  <th className="py-3 pr-4">Unit Price</th>
                  <th className="py-3">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 pr-4">{item.product_name}</td>
                    <td className="py-3 pr-4">{item.size_label}</td>
                    <td className="py-3 pr-4">
                      {item.type_label || "—"}
                    </td>
                    <td className="py-3 pr-4">{item.quantity}</td>
                    <td className="py-3 pr-4">
                      {formatPrice(item.unit_price)}
                    </td>
                    <td className="py-3">
                      {formatPrice(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-lg border p-5 space-y-3">
        <h2 className="text-lg font-semibold">Order Total</h2>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{formatPrice(order.delivery_fee)}</span>
        </div>

        <div className="flex justify-between border-t pt-3 font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </section>
    </main>
  );
}