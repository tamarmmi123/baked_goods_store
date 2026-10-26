
import { Link } from "react-router-dom";
import { useGetPendingProductionSummaryQuery } from "../api/ordersApi";

export default function ProductionDashboardPage() {
  const { data, isLoading, isError } =
    useGetPendingProductionSummaryQuery();

  if (isLoading) return <main className="p-6">Loading production summary...</main>;
  if (isError) return <main className="p-6 text-red-600">Unable to load production data.</main>;

  const items = data?.items ?? [];
  const totalUnits = items.reduce(
    (sum, item) => sum + item.quantity_to_make,
    0
  );
  const maxQuantity = Math.max(
    1,
    ...items.map((item) => item.quantity_to_make)
  );

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Production Dashboard</h1>
          <p className="text-gray-600">
            Quantities required for pending orders
          </p>
        </div>
        <Link to="/orders" className="underline">
          View all orders
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border p-5">
          <p className="text-sm text-gray-600">Total units to make</p>
          <p className="mt-2 text-3xl font-bold">{totalUnits}</p>
        </section>
        <section className="rounded-lg border p-5">
          <p className="text-sm text-gray-600">Product variations</p>
          <p className="mt-2 text-3xl font-bold">{items.length}</p>
        </section>
      </div>

      <section className="rounded-lg border p-5">
        <h2 className="mb-5 text-lg font-semibold">
          Units required by product
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-600">
            No pending orders require production right now.
          </p>
        ) : (
          <div className="space-y-5">
            {items.map((item) => (
              <div key={`${item.product_id}-${item.product_size_id}-${item.product_type_id ?? "none"}`}>
                <div className="mb-1 flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-medium">
                    {item.product_name} — {item.size_label}
                    {item.type_label ? ` — ${item.type_label}` : ""}
                  </span>
                  <span className="font-semibold">
                    {item.quantity_to_make} units
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded bg-gray-100">
                  <div
                    className="h-full rounded bg-primary"
                    style={{
                      width: `${(item.quantity_to_make / maxQuantity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-x-auto rounded-lg border">
        <div className="p-5">
          <h2 className="text-lg font-semibold">Production list</h2>
          <p className="text-sm text-gray-600">
            Use this table as the quantity checklist for making products.
          </p>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y bg-gray-50">
              <th className="p-3">Product</th>
              <th className="p-3">Size</th>
              <th className="p-3">Type</th>
              <th className="p-3">Pending orders</th>
              <th className="p-3">Units to make</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.product_id}-${item.product_size_id}-${item.product_type_id ?? "none"}`}
                className="border-b"
              >
                <td className="p-3">{item.product_name}</td>
                <td className="p-3">{item.size_label}</td>
                <td className="p-3">{item.type_label || "—"}</td>
                <td className="p-3">{item.order_count}</td>
                <td className="p-3 font-bold">{item.quantity_to_make}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
