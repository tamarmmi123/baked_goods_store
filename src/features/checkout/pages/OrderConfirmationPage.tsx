
import { Link, useLocation, useParams } from "react-router-dom";
import { Order } from "../types/types";
import { useGetOrderQuery } from "../api/checkoutApi";

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const stateOrder = (location.state as { order?: Order } | null)?.order;

  const {
    data: fetchedOrder,
    isLoading,
    isError,
  } = useGetOrderQuery(orderId ?? "", {
    skip: !orderId || !!stateOrder,
  });

  const order = stateOrder ?? fetchedOrder;

  if (isLoading) {
    return <p className="p-8 text-center">Loading order...</p>;
  }

  if (!order || isError) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-gray-500">
          We couldn't load this order. Please check your order link.
        </p>
        <Link className="mt-5 inline-block text-primary underline" to="/products">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-border text-3xl text-primary">
        ✓
      </div>

      <h1 className="text-3xl font-semibold">Thank you for your order!</h1>
      <p className="mt-3 text-gray-500">
        Your order has been created successfully.
      </p>

      <section className="mt-8 rounded-2xl border p-6 text-left">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Order number</span>
          <span className="font-medium">{order.id}</span>
        </div>

        <div className="mt-4 flex justify-between gap-4">
          <span className="text-gray-500">Status</span>
          <span className="font-medium">{order.status}</span>
        </div>

        <div className="mt-4 flex justify-between gap-4">
          <span className="text-gray-500">Total</span>
          <span className="text-xl font-bold">
            ₪{Number(order.total).toFixed(2)}
          </span>
        </div>

        <p className="mt-5 border-t pt-4 text-sm text-gray-500">
          Payment processing will be added later. This confirmation means
          your order was created, not that payment was collected.
        </p>
      </section>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
      >
        Continue shopping
      </Link>
    </main>
  );
}