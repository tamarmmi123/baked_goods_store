import React, { useState, useEffect } from "react";
import { useGetAllProductsQuery } from "../api/productsApi";
import { Product } from "../types/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { useDeleteProductMutation } from "../api/productsApi";

const Products: React.FC = () => {
  const { data: products, error, isLoading } = useGetAllProductsQuery();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const searchTerm = searchParams.get("search") || "";

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const navigate = useNavigate();

  const filteredProducts =
    products?.filter(
      (product) =>
        product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }));
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      // TODO: Add to cart logic
      console.log(`Added ${quantity} of ${product.productname} to cart`);
      setQuantities((prev) => ({
        ...prev,
        [product.id]: 1,
      }));
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No products found.
          </div>
        ) : (
          filteredProducts.map((product: Product) => (
            <div
              key={product.id}
              onMouseLeave={() => setOpenMenuId(null)}
              className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden group"
            >
              <img
                src={product.imageUrl}
                alt={product.productname}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <h2 className="text-xl font-semibold mb-2">
                {product.productname}
              </h2>

              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">₪{product.price}</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === product.id ? null : product.id
                        )
                      }
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openMenuId === product.id && (
                      <div className="absolute bottom-12 w-32 bg-white border rounded-lg shadow-lg z-20">
                        <button
                          onClick={() => {
                            navigate(`/products/update/${product.id}`);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-background text-sm text-gray-600"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                          <span>Update</span>
                        </button>

                        <button
                          onClick={() => setDeleteModalId(product.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-background text-sm text-gray-600"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      disabled={(quantities[product.id] || 1) <= 1}
                      className="w-6 h-6 text-gray-500 font-bold"
                    >
                      -
                    </button>

                    <span className="w-10 text-center font-semibold">
                      {quantities[product.id] || 1}
                    </span>

                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      disabled={(quantities[product.id] || 1) >= product.qty}
                      className="w-6 h-6 text-gray-500 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg font-medium border border-gray-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteModalId}
        message={`Are you sure you want to delete ${
          products?.find((p) => p.id === deleteModalId)?.productname
        }?`}
        onCancel={() => setDeleteModalId(null)}
        onConfirm={async () => {
          if (!deleteModalId) return;

          try {
            await deleteProduct(deleteModalId).unwrap();
            setDeleteModalId(null);
          } catch (err) {
            console.error("Failed to delete product", err);
          }
        }}
      />
    </div>
  );
};

export default Products;
