import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "../api/productsApi";
import UpdateForm from "../components/UpdateForm";
import { useEffect, useState } from "react";
import { Product } from "../types/types";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: product,
    isLoading: isFetching,
    refetch,
  } = useGetProductByIdQuery(id!);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const [formData, setFormData] = useState<Product | null>(null);

  useEffect(() => {
    if (product) setFormData(product);
  }, [product]);

  const handleUpdate = async (data: any) => {
    try {
      await updateProduct({ id: id!, data }).unwrap();
      await refetch();
      navigate("/products");
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  if (isFetching) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6 flex justify-center">
      <div>
        <h1 className="text-2xl mb-4">Update Product</h1>
        {formData && (
          <UpdateForm
            initialData={formData}
            onSubmit={handleUpdate}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
