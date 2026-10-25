import { Link, useParams } from "react-router-dom";
import { useGetOrderQuery } from "../../checkout/api/checkoutApi";

const formatPrice = (value: string | number | undefined) =>
  `₪${Number(value ?? 0).toFixed(2)}`;

export default function MyOrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderQuery(orderId!, {
    skip: !orderId,
  });

  if (isLoading) {
    return <main className="p-6">Loading order details...</main>;
  }

  if (isError || !order) {
    return (
      <main className="mx-auto max-w-5xl space-y-4 p-6">
        <p className="text-red-600">
          Unable to load this order. It may not exist or you may not have
          permission to view it.
        </p>
        <Link to="/my-orders" className="underline">
          Back to My Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="break-all text-sm text-gray-500">
            Order #{order.id}
          </p>
        </div>

        <Link to="/my-orders" className="underline">
          Back to My Orders
        </Link>
      </div>

      <section className="space-y-2 rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <p>
          <strong>Order date:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{order.status}</span>
        </p>
        <p>
          <strong>Payment status:</strong>{" "}
          <span className="capitalize">{order.payment_status}</span>
        </p>
      </section>

      <section className="space-y-2 rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Delivery Details</h2>
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
        <h2 className="mb-4 text-lg font-semibold">Products</h2>

        {!order.items?.length ? (
          <p className="text-gray-500">No products found for this order.</p>
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
                    <td className="py-3 pr-4">{item.type_label || "—"}</td>
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

      <section className="ml-auto max-w-sm space-y-3 rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Total</h2>
        <div className="flex justify-between gap-4">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Delivery</span>
          <span>{formatPrice(order.delivery_fee)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t pt-3 font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </section>
    </main>
  );
}