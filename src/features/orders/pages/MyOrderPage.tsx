import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../api/ordersApi";

const formatPrice = (value: string) => `₪${Number(value).toFixed(2)}`;

export default function MyOrdersPage() {
  const { data, isLoading, isError } = useGetMyOrdersQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <p>Loading your orders...</p>;
  if (isError) return <p>Unable to load your orders. Please try again.</p>;

  const orders = data?.orders ?? [];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded border p-6">
          <p>You haven't placed any orders yet.</p>
          <Link className="mt-3 inline-block underline" to="/products">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded border p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="capitalize">{order.status}</p>
                  <p className="text-sm text-gray-600">
                    Payment: {order.payment_status}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm">{order.item_count ?? 0} items</p>

              <Link
                className="mt-3 inline-block underline"
                to={`/my-orders/${order.id}`}
              >
                View order
              </Link>
            </article>
          ))}
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <p className="mt-4 text-sm text-gray-600">
          Page {data.pagination.page} of {data.pagination.totalPages}
        </p>
      )}
    </main>
  );
}
