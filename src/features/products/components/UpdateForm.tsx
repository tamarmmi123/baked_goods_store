import { useState, useEffect } from "react";
import { Product } from "../types/types";
import {
  SPECIAL_REQUIREMENTS,
  OCCASIONS,
} from "../../../assets/constants/productOptions";

type Props = {
  initialData: Product;
  onSubmit: (data: Partial<Product>) => void;
  isLoading?: boolean;
};

export default function UpdateForm({
  initialData,
  onSubmit,
  isLoading,
}: Props) {
  const [form, setForm] = useState<Partial<Product>>({
    productname: "",
    description: "",
    qty: 0,
    price: 0,
    imageUrl: "",
    kashrut: "parav",
    specialRequirements: [],
    occasions: [],
  });

  useEffect(() => {
    setForm({
      productname: initialData.productname || "",
      description: initialData.description || "",
      qty: initialData.qty || 0,
      price: initialData.price || 0,
      imageUrl: initialData.imageUrl || "",
      kashrut: initialData.kashrut || "parav",
      specialRequirements: Array.isArray(initialData.specialRequirements)
        ? initialData.specialRequirements
        : JSON.parse(initialData.specialRequirements || "[]"),
      occasions: Array.isArray(initialData.occasions)
        ? initialData.occasions
        : JSON.parse(initialData.occasions || "[]"),
    });
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "qty" ? Number(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (
    field: "specialRequirements" | "occasions",
    value: string
  ) => {
    const current = form[field] || [];
    if (current.includes(value)) {
      setForm((prev) => ({
        ...prev,
        [field]: current.filter((v) => v !== value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: [...current, value],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <label htmlFor="productname" className="block font-semibold mb-1">
        Product Name
      </label>
      <input
        name="productname"
        placeholder="Product name"
        value={form.productname || ""}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
        required
      />

      <label htmlFor="description" className="block font-semibold mb-1">
        Description
      </label>
      <textarea
        name="description"
        placeholder="Description"
        value={form.description || ""}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      />

      {/* Quantity field is commented out */}
      {/* <label htmlFor="qty" className="block font-semibold mb-1">
        Quantity
      </label>
      <input
        type="number"
        name="qty"
        placeholder="Quantity"
        value={form.qty || 0}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      /> */}

      <label htmlFor="price" className="block font-semibold mb-1">
        Price
      </label>
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price || 0}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
        required
      />

      <label htmlFor="kashrut" className="block font-semibold mb-1">
        Kashrut
      </label>
      <select
        name="kashrut"
        value={form.kashrut || "parav"}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        <option value="milk">Milk</option>
        <option value="parav">Parav</option>
        <option value="meat">Meat</option>
      </select>

      <div>
        <label className="block font-semibold mb-1">Special Requirements</label>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_REQUIREMENTS.map((req) => (
            <label
              key={req}
              className="flex items-center gap-1 border px-2 py-1 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(form.specialRequirements || []).includes(req)}
                onChange={() =>
                  handleCheckboxChange("specialRequirements", req)
                }
                className="accent-primary"
              />
              {req}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Occasions</label>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occ) => (
            <label
              key={occ}
              className="flex items-center gap-1 border px-2 py-1 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(form.occasions || []).includes(occ)}
                onChange={() => handleCheckboxChange("occasions", occ)}
                className="accent-primary"
              />
              {occ}
            </label>
          ))}
        </div>
      </div>

      <label htmlFor="imageUrl">Image URL</label>
      <input
        name="imageUrl"
        placeholder="Image URL"
        value={form.imageUrl || ""}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-primary text-white shadow-sm py-2 rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Update Product"}
      </button>
    </form>
  );
}
