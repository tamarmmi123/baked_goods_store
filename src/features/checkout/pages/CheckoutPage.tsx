
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { cartApi, useGetActiveCartQuery } from "../../cart/api/cartApi";
import {
  useCreateOrderMutation,
  useGetProfileQuery,
} from "../api/checkoutApi";
import { useDispatch } from "react-redux";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useAuth();
  const userId = user?.id;

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetProfileQuery();

  const {
    data: cart,
    isLoading: cartLoading,
    isError: cartError,
  } = useGetActiveCartQuery(userId ?? "", {
    skip: !userId,
  });

  const [createOrder, { isLoading: submitting }] =
    useCreateOrderMutation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.username ?? "");
    setEmail(profile.email ?? "");
    setAddress(profile.address?.street ?? "");
    setCity(profile.address?.city ?? "");
    setPostalCode(profile.address?.zip ?? "");
  }, [profile]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!cart || cart.items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    try {
      const response = await createOrder({
        cartId: cart.id,
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
      }).unwrap();

      dispatch(cartApi.util.invalidateTags(["Cart"]));

      navigate(`/order-confirmation/${response.order.id}`, {
        state: { order: response.order },
      });
    } catch (error: any) {
      setErrorMessage(
        error?.data?.error ??
          "Checkout failed. Please review your cart and try again."
      );
    }
  };

  if (profileLoading || cartLoading) {
    return <p className="p-8 text-center">Loading checkout...</p>;
  }

  if (profileError || cartError || !profile || !cart) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <p>Unable to load your profile or cart.</p>
        <button
          onClick={() => navigate("/shopping-cart")}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white"
        >
          Return to cart
        </button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white"
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold">Checkout</h1>
      <p className="mb-8 text-gray-500">
        Confirm your delivery details before placing your order.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-2xl border p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Delivery information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Full name
              <input
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg border p-3"
              />
            </label>

            <label className="grid gap-1 text-sm">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border p-3"
              />
            </label>

            <label className="grid gap-1 text-sm sm:col-span-2">
              Phone
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border p-3"
              />
            </label>

            <label className="grid gap-1 text-sm sm:col-span-2">
              Street address
              <input
                required
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-lg border p-3"
              />
            </label>

            <label className="grid gap-1 text-sm">
              City
              <input
                required
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border p-3"
              />
            </label>

            <label className="grid gap-1 text-sm">
              ZIP / postal code
              <input
                required
                autoComplete="postal-code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="rounded-lg border p-3"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border p-6">
          <h2 className="mb-3 text-xl font-semibold">Order summary</h2>
          <p className="text-gray-600">
            {cart.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            item(s) across {cart.items.length} cart line(s)
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Prices and stock will be validated by the server when you
            place the order. Delivery is currently free in this version.
          </p>
        </section>

        {errorMessage && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary px-5 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </main>
  );
}
