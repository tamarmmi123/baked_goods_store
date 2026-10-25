import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../types/types";
import { useUpdateItemMutation, useRemoveItemMutation } from "../api/cartApi";
import { useGetProductByIdQuery } from "../../products/api/productsApi";

interface Props {
  item: CartItem;
}

export default function CartItemCard({ item }: Props) {
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveItemMutation();
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(item.product_id);

  const selectedSize = product?.sizes?.find(
    (size) => String(size.id) === String(item.size_id),
  );

  const selectedType = product?.types?.find(
    (type) => String(type.id) === String(item.type_id),
  );

  useEffect(() => {
    if (product) {
      console.log("Cart item:", item);
      console.log("Product types:", product.types);
      console.log("Saved type ID:", item.type_id);
      console.log("Selected type:", selectedType);
    }
  }, [product, item, selectedType]);

  const rawPrice = selectedSize?.price ?? product?.sizes?.[0]?.price;
  const unitPrice =
    rawPrice !== undefined && rawPrice !== null ? Number(rawPrice) : undefined;

  const handleQuantityChange = async (value: number) => {
    if (
      !Number.isInteger(value) ||
      value < 1 ||
      value === quantity ||
      isUpdating
    ) {
      return;
    }

    const previousQuantity = quantity;
    setQuantity(value);

    try {
      await updateItem({
        itemId: item.id,
        quantity: value,
      }).unwrap();
    } catch {
      setQuantity(previousQuantity);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;

    try {
      await removeItem(item.id).unwrap();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-36 animate-pulse rounded-2xl border border-gray-100 bg-white" />
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-600">Unable to load this product.</p>

        <button
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label="Remove unavailable product from cart"
          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <article className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 sm:gap-5 sm:p-5">
      {selectedType?.imageUrl ? (
        <img
          src={selectedType.imageUrl}
          alt={product.productname}
          className="h-24 w-24 shrink-0 rounded-xl bg-gray-50 object-cover sm:h-28 sm:w-28"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400 sm:h-28 sm:w-28">
          No image
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold leading-5 text-gray-900">
              {product.productname}
            </h3>
            <h2 className="mt-1 text-sm text-gray-500">
              {selectedType?.description}
            </h2>

            {selectedSize && (
              <p className="mt-1.5 text-sm text-gray-500">
                Size: {selectedSize.label}
              </p>
            )}

            {selectedType && (
              <p className="mt-1 text-sm text-gray-500">
                Type: {selectedType.typeLabel}
              </p>
            )}
          </div>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label={`Remove ${product.productname} from cart`}
            title="Remove item"
            className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-primary disabled:opacity-50"
          >
            <Trash2 size={17} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <div
            className="inline-flex items-center rounded-lg border border-gray-200"
            aria-label="Quantity controls"
          >
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating || isRemoving}
              aria-label="Decrease quantity"
              className="rounded-l-lg p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-8 text-center text-sm font-medium tabular-nums">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating || isRemoving}
              aria-label="Increase quantity"
              className="rounded-r-lg p-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right">
            {unitPrice !== undefined && Number.isFinite(unitPrice) && (
              <>
                <p className="text-sm text-gray-500">
                  ₪{unitPrice.toFixed(2)} each
                </p>
                <p className="mt-0.5 font-semibold text-gray-900">
                  ₪{(unitPrice * quantity).toFixed(2)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
