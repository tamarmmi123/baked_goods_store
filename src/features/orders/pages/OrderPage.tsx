import { useState } from "react";
import { Link } from "react-router-dom";
import type { Order, OrderStatus } from "../types/types";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../api/ordersApi";

const statuses: OrderStatus[] = [
  "pending",
  "processing",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetAllOrdersQuery({
    page,
    limit: 10,
    status,
    search,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders = data?.orders ?? [];

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const changeStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateStatus({ orderId, status: nextStatus }).unwrap();
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "error" in error.data
          ? String(error.data.error)
          : "Unable to update order status.";

      window.alert(message);
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Manage Orders</h1>

      <form onSubmit={submitSearch} className="mb-5 flex flex-wrap gap-3">
        <input
          className="rounded border p-2"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search order, name, or email"
        />

        <button className="rounded border px-4 py-2" type="submit">
          Search
        </button>

        <select
          className="rounded border p-2"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as OrderStatus | "");
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </form>

      {isLoading && <p>Loading orders...</p>}
      {isError && <p>Unable to load orders.</p>}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order: Order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">
                      <div>{order.full_name}</div>
                      <div className="text-sm text-gray-600">{order.email}</div>
                    </td>
                    <td className="p-3">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">₪{Number(order.total).toFixed(2)}</td>
                    <td className="p-3">{order.payment_status}</td>
                    <td className="p-3">
                      <select
                        className="rounded border p-2"
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(event) =>
                          void changeStatus(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                      >
                        {statuses.map((value) => (
                          <option
                            key={value}
                            value={value}
                            disabled={
                              value !== order.status &&
                              !(
                                {
                                  pending: ["processing", "cancelled"],
                                  processing: ["delivered", "cancelled"],
                                  delivered: [],
                                  cancelled: [],
                                }[order.status] as OrderStatus[]
                              ).includes(value)
                            }
                          >
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && <p className="mt-4">No orders found.</p>}

          {data && data.pagination.totalPages > 1 && (
            <div className="mt-5 flex items-center gap-4">
              <button
                className="rounded border px-3 py-2"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <span>
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>

              <button
                className="rounded border px-3 py-2"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
