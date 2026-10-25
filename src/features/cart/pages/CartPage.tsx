
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetActiveCartQuery } from "../api/cartApi";
import CartItemCard from "../components/CartItemCard";
import CartSummary from "../components/CartSummary";

export default function CartPage({ userId }: { userId: string }) {
  const {
    data: cart,
    isLoading,
    isError,
  } = useGetActiveCartQuery(userId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-36 rounded-2xl bg-white" />
          <div className="h-36 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            Couldn't load your cart
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please try again in a moment.
          </p>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag size={28} className="text-gray-500" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Explore products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            YOUR SHOPPING BAG
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Your cart
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Review your items before checking out.
              </p>
            </div>

            <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-600 ring-1 ring-gray-200">
              {cart.items.length}{" "}
              {cart.items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            {/* <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart items
              </h2>
              <span className="text-sm text-gray-500">
                {cart.items.length} products
              </span>
            </div> */}

            <div className="space-y-3">
              {cart.items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>
          </section>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Order summary
              </h2>

              <CartSummary cart={cart} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
