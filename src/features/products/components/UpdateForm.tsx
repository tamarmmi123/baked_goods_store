import { useState, useEffect } from "react";
import { Product } from "../types/types";

type Props = {
  initialData: Product;
  onSubmit: (data: Partial<Product>) => void;
  isLoading?: boolean;
};

export default function UpdateForm({ initialData, onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<Partial<Product>>({
    productname: "",
    description: "",
    qty: 0,
    price: 0,
    imageUrl: "",
  });

  useEffect(() => {
    setForm({
      productname: initialData.productname || "",
      description: initialData.description || "",
      qty: initialData.qty || 0,
      price: initialData.price || 0,
      imageUrl: initialData.imageUrl || "",
    });
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "qty" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        name="productname"
        placeholder="Product name"
        value={form.productname || ""}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description || ""}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      />

      <input
        type="number"
        name="qty"
        placeholder="Quantity"
        value={form.qty || 0}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price || 0}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
        required
      />

      <input
        name="imageUrl"
        placeholder="Image URL"
        value={form.imageUrl || ""}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-primary text-white shadow-sm py-2 rounded-lg
                     hover:bg-primary-hover transition disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Update Product"}
      </button>
    </form>
  );
}
