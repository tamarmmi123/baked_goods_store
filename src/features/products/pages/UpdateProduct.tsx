import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProductMutation, useGetProductByIdQuery } from "../api/productsApi";
import UpdateForm from "../components/UpdateForm";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: product, isLoading: isFetching } = useGetProductByIdQuery(id!);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleUpdate = async (data: any) => {
    try {
      await updateProduct({ id: id!, data }).unwrap();
      navigate("/products");
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  if (isFetching) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Update Product</h1>
      <UpdateForm
        initialData={product}
        onSubmit={handleUpdate}
        isLoading={isLoading}
      />
    </div>
  );
}
