import { useNavigate } from "react-router-dom";
import { useAddProductMutation } from "../api/productsApi";
import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleAdd = async (data: any) => {
    try {
      await addProduct(data).unwrap();
      navigate("/products");
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Add Product</h1>
      <ProductForm onSubmit={handleAdd} isLoading={isLoading} />
    </div>
  );
}
