import React, { useState, useEffect } from "react";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../api/productsApi";
import { Product } from "../types/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, AlertCircle } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  useAddItemMutation,
  useGetActiveCartQuery,
} from "../../cart/api/cartApi";
import ProductFilter from "./ProductFilter";

const Products: React.FC = () => {
  const { data: products, error, isLoading } = useGetAllProductsQuery();

  const [selectedKashrut, setSelectedKashrut] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>(
    [],
  );

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
    {},
  );
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const user = useAuth();
  const isAdmin = user?.role === "admin";

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const navigate = useNavigate();
  const [deleteProduct] = useDeleteProductMutation();

  const getSelectedType = (product: Product) => {
    if (!product.types?.length) return null;
    const key = String(product.id);

    return (
      product.types.find((t) => String(t.id) === selectedTypes[key]) ??
      product.types[0]
    );
  };

  const getSelectedSize = (product: Product) => {
    if (!product.sizes?.length) return null;
    const key = String(product.id);

    return (
      product.sizes.find((s) => String(s.id) === selectedSizes[key]) ??
      product.sizes[0]
    );
  };

  useEffect(() => {
    if (!products) return;

    setSelectedTypes((prev) => {
      const next = { ...prev };
      products.forEach((p) => {
        const key = String(p.id);
        if (!next[key] && p.types?.length) {
          next[key] = String(p.types[0].id);
        }
      });
      return next;
    });

    setSelectedSizes((prev) => {
      const next = { ...prev };
      products.forEach((p) => {
        const key = String(p.id);
        if (!next[key] && p.sizes?.length) {
          next[key] = String(p.sizes[0].id);
        }
      });
      return next;
    });

    setQuantities((prev) => {
      const next = { ...prev };
      products.forEach((p) => {
        const key = String(p.id);
        if (!next[key]) next[key] = 1;
      });
      return next;
    });
  }, [products]);

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }));
  };

  const { data: cart } = useGetActiveCartQuery(user?.id ?? skipToken);
  const [addItem] = useAddItemMutation();

  const addToCart = async (product: Product) => {
    const key = String(product.id);
    const size = getSelectedSize(product);
    const type = getSelectedType(product);

    if (!size || !type) return;

    try {
      if (!cart?.id) {
        alert("Cart not loaded yet!");
        return;
      }

      await addItem({
        cart_id: cart.id,
        product_id: String(product.id),
        size_id: String(size.id),
        type_id: String(type.id),
        quantity: quantities[key] || 1,
      }).unwrap();

      setQuantities((prev) => ({ ...prev, [key]: 1 }));
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert("Failed to add to cart");
    }
  };

  const filteredProducts =
    products?.filter((product) => {
      const term = searchTerm.toLowerCase();

      const nameMatch = product.productname.toLowerCase().includes(term);

      const descriptionMatch =
        product.types?.some((t) =>
          (t.description || "").toLowerCase().includes(term),
        ) ?? false;

      const searchMatch = nameMatch || descriptionMatch;

      const kashrutMatch =
        selectedKashrut.length === 0 ||
        selectedKashrut.includes(product.kashrut);

      const foodTypeMatch =
        selectedFoodTypes.length === 0 ||
        selectedFoodTypes.some(
          (type) =>
            type.toLowerCase() === product.category?.trim().toLowerCase(),
        );

      const min = minPrice === "" ? 0 : Number(minPrice);
      const max = maxPrice === "" ? Infinity : Number(maxPrice);

      const priceMatch = product.sizes.some(
        (size) => size.price >= min && size.price <= max,
      );

      const requirementsMatch = selectedRequirements.every(
        (requirement) =>
          product.specialrequirements?.includes(requirement) ?? false,
      );

      return (
        searchMatch &&
        kashrutMatch &&
        foodTypeMatch &&
        priceMatch &&
        requirementsMatch
      );
    }) ?? [];

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:sticky lg:top-6">
          {/* <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
            <h2 className="text-xl font-bold mb-5">Filters</h2> */}

          <ProductFilter
            products={products ?? []}
            selectedKashrut={selectedKashrut}
            onKashrutChange={setSelectedKashrut}
            selectedTypes={selectedFoodTypes}
            onTypesChange={setSelectedFoodTypes}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            selectedRequirements={selectedRequirements}
            onRequirementsChange={setSelectedRequirements}
          />
          {/* </div> */}
        </aside>

        {/* RIGHT SIDE: PRODUCTS */}
        <main className="min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg py-12">
                No products found.
              </div>
            ) : (
              filteredProducts.map((product) => {
                const key = String(product.id);
                const selectedType = getSelectedType(product);
                const selectedSize = getSelectedSize(product);

                if (!selectedType || !selectedSize) {
                  return (
                    <div
                      key={key}
                      className="bg-white rounded-lg shadow-md p-6 text-gray-400"
                    >
                      Invalid product data
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    onMouseLeave={() => setOpenMenuId(null)}
                    className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden group flex flex-col h-full"
                  >
                    <div className="flex flex-col flex-grow">
                      <img
                        src={selectedType.imageUrl || "/placeholder.png"}
                        alt={product.productname}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />

                      {product.types.length > 1 && (
                        <div className="flex justify-center mb-4 space-x-2">
                          {product.types.map((type) => (
                            <button
                              key={type.id}
                              onClick={() =>
                                setSelectedTypes((prev) => ({
                                  ...prev,
                                  [key]: String(type.id),
                                }))
                              }
                              className={`w-3 h-3 rounded-full border-2 transition-colors ${
                                selectedTypes[key] === String(type.id)
                                  ? "bg-gray-600 border-gray-400"
                                  : "bg-primary-500 border-primary-700"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="min-w-0">
                          <h2 className="text-xl font-semibold mb-2">
                            {product.productname}
                          </h2>
                          <p className="text-gray-600">
                            {selectedType.description ||
                              "No description available"}
                          </p>
                        </div>

                        {product.specialrequirements?.length > 0 && (
                          <div className="relative shrink-0">
                            <AlertCircle className="peer w-5 h-5 text-gray-500 cursor-pointer" />
                            <div className="absolute bottom-full mb-2 right-0 hidden peer-hover:block bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-700 z-50 w-max max-w-xs">
                              <ul className="space-y-1">
                                {product.specialrequirements.map((req, i) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {product.sizes.length > 1 ? (
                      <div className="my-2">
                        <select
                          value={selectedSizes[key]}
                          onChange={(e) =>
                            setSelectedSizes((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full border rounded px-3 py-2 text-sm bg-white"
                        >
                          {product.sizes
                            .slice()
                            .sort((a, b) => a.price - b.price)
                            .map((size) => (
                              <option key={size.id} value={String(size.id)}>
                                {size.label} – ₪{size.price}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      <div className="my-2 font-semibold">
                        {selectedSize.label} – ₪{selectedSize.price}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-auto pt-4 gap-2">
                      <span className="text-2xl font-bold">
                        ₪{selectedSize.price}
                      </span>
                      <span className="font-bold">
                        {product.kashrut.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-200">
                      <div className="flex items-center justify-between gap-2">
                        {isAdmin && (
                          <div className="relative shrink-0">
                            <button
                              onClick={() =>
                                setOpenMenuId(openMenuId === key ? null : key)
                              }
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>

                            {openMenuId === key && (
                              <div className="absolute bottom-12 left-0 w-32 bg-white border rounded-lg shadow-lg z-20">
                                <button
                                  onClick={() =>
                                    navigate(`/products/update/${key}`)
                                  }
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Update
                                </button>
                                <button
                                  onClick={() => setDeleteModalId(key)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(key, -1)}
                            disabled={(quantities[key] || 1) <= 1}
                            className="w-6 h-6 font-bold text-gray-500"
                          >
                            –
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {quantities[key] || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(key, 1)}
                            className="w-6 h-6 font-bold text-gray-500"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          className="bg-primary-500 hover:bg-primary-600 px-3 py-2 rounded-lg font-medium border border-gray-600 text-sm whitespace-nowrap"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={!!deleteModalId}
        message={`Are you sure you want to delete ${
          products?.find((p) => String(p.id) === deleteModalId)?.productname
        }?`}
        onCancel={() => setDeleteModalId(null)}
        onConfirm={async () => {
          if (!deleteModalId) return;
          await deleteProduct(deleteModalId).unwrap();
          setDeleteModalId(null);
        }}
      />
    </div>
  );
};

export default Products;
