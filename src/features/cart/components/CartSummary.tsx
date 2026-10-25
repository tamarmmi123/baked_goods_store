import { useEffect, useState } from "react";
import { Cart, CartItem } from "../types/types";
import { useCheckoutMutation } from "../api/cartApi";
import { useGetProductByIdQuery } from "../../products/api/productsApi";
import { ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {
  cart: Cart;
}

interface PriceResult {
  itemId: string;
  subtotal: number | null;
  loading: boolean;
}

export default function CartSummary({ cart }: Props) {
  const navigate = useNavigate();
  const [checkout, { isLoading }] = useCheckoutMutation();
  const [prices, setPrices] = useState<Record<string, PriceResult>>({});

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setPrices({});
  }, [cart.id, cart.items]);

  const handlePriceUpdate = (result: PriceResult) => {
    setPrices((previous) => {
      const existing = previous[result.itemId];

      if (
        existing?.subtotal === result.subtotal &&
        existing?.loading === result.loading
      ) {
        return previous;
      }

      return {
        ...previous,
        [result.itemId]: result,
      };
    });
  };

  const allPricesLoaded = cart.items.every(
    (item) => prices[item.id] && !prices[item.id].loading,
  );

  const hasPriceError = cart.items.some(
    (item) => prices[item.id]?.subtotal === null,
  );

  const subtotal = cart.items.reduce((sum, item) => {
    const price = prices[item.id]?.subtotal;

    return price !== null && price !== undefined ? sum + price : sum;
  }, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div>
      {/* Hidden price loaders report each item's subtotal */}
      <div className="hidden">
        {cart.items.map((item) => (
          <CartPriceLoader
            key={item.id}
            item={item}
            onPriceUpdate={handlePriceUpdate}
          />
        ))}
      </div>

      {/* Order details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">Items ({totalItems})</span>
          <span className="font-medium text-gray-900">
            {!allPricesLoaded
              ? "Calculating..."
              : hasPriceError
                ? "Unavailable"
                : `₪${subtotal.toFixed(2)}`}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-gray-500">Delivery</span>
          <span className="text-right text-gray-500">
            Calculated at checkout
          </span>
        </div>
      </div>

      <div className="my-5 border-t border-gray-100" />

      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-gray-900">Estimated total</span>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          {!allPricesLoaded
            ? "..."
            : hasPriceError
              ? "Unavailable"
              : `₪${subtotal.toFixed(2)}`}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={cart.items.length === 0 || !allPricesLoaded || hasPriceError}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        Proceed to checkout
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck size={15} />
        <span>Secure checkout</span>
      </div>

      <div className="mt-5 flex items-start gap-3 border-t border-gray-100 pt-4">
        <Truck size={18} className="mt-0.5 shrink-0 text-gray-400" />
        <p className="text-xs leading-5 text-gray-500">
          Delivery costs will be confirmed during checkout.
        </p>
      </div>
    </div>
  );
}

function CartPriceLoader({
  item,
  onPriceUpdate,
}: {
  item: CartItem;
  onPriceUpdate: (result: PriceResult) => void;
}) {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(item.product_id);

  useEffect(() => {
    if (isLoading) {
      onPriceUpdate({
        itemId: item.id,
        subtotal: null,
        loading: true,
      });
      return;
    }

    if (isError || !product) {
      onPriceUpdate({
        itemId: item.id,
        subtotal: null,
        loading: false,
      });
      return;
    }

    const size =
      product.sizes?.find((s) => s.id === item.size_id) ?? product.sizes?.[0];

    const unitPrice = Number(size?.price);

    onPriceUpdate({
      itemId: item.id,
      subtotal:
        size && Number.isFinite(unitPrice) ? unitPrice * item.quantity : null,
      loading: false,
    });
  }, [
    item.id,
    item.quantity,
    item.size_id,
    isLoading,
    isError,
    product,
    onPriceUpdate,
  ]);

  return null;
}
