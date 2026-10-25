import { useState, useEffect } from "react";
import { Product, ProductSize } from "../types/types";
import {
  SPECIAL_REQUIREMENTS,
  OCCASIONS,
} from "../../../assets/constants/productOptions";

type ProductType = {
  id: string;
  typeLabel: string;
  imageUrl: string;
  description: string;
};

type Props = {
  initialData: Product & { types?: ProductType[] };
  onSubmit: (data: FormState) => void;
  isLoading?: boolean;
};

type FormState = {
  productname: string;
  category: string;
  kashrut: "milky" | "parev" | "meaty";
  specialrequirements: string[];
  occasions: string[];
  sizes: ProductSize[];
  types: ProductType[];
};

export default function UpdateForm({
  initialData,
  onSubmit,
  isLoading,
}: Props) {
  const [form, setForm] = useState<FormState>({
    productname: initialData.productname || "",
    category: initialData.category || "",
    kashrut: initialData.kashrut || "parev",
    specialrequirements: initialData.specialrequirements || [],
    occasions: initialData.occasions || [],
    sizes:
      initialData.sizes && initialData.sizes.length > 0
        ? initialData.sizes
        : [{ id: crypto.randomUUID(), label: "Default", price: 0, qty: 0 }],
    types:
      initialData.types && initialData.types.length > 0
        ? initialData.types.map((t) => ({
            id: t.id,
            typeLabel: t.typeLabel || "",
            imageUrl: t.imageUrl || "",
            description: t.description || "",
          }))
        : [
            {
              id: crypto.randomUUID(),
              typeLabel: "Default",
              imageUrl: "",
              description: "",
            },
          ],
  });


  useEffect(() => {
    setForm({
      productname: initialData.productname || "",
      category: initialData.category || "",
      kashrut: initialData.kashrut || "parev",
      specialrequirements: Array.isArray(initialData.specialrequirements)
        ? initialData.specialrequirements
        : [],
      occasions: Array.isArray(initialData.occasions)
        ? initialData.occasions
        : [],
      sizes:
        initialData.sizes?.length > 0
          ? initialData.sizes
          : [{ id: crypto.randomUUID(), label: "", price: 0, qty: 0 }],
      types:
        initialData.types?.length > 0
          ? initialData.types.map((t) => ({
              id: t.id,
              typeLabel: t.typeLabel || "",
              imageUrl: t.imageUrl || "",
              description: t.description || "",
            }))
          : [
              {
                id: crypto.randomUUID(),
                typeLabel: "",
                imageUrl: "",
                description: "",
              },
            ],
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
    field: "specialrequirements" | "occasions",
    value: string
  ) => {
    const current = form[field] || [];
    setForm((prev) => ({
      ...prev,
      [field]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    }));
  };

  const handleSizeChange = (
    id: string,
    field: keyof Omit<ProductSize, "id">,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) =>
        s.id === id
          ? { ...s, [field]: field === "label" ? value : Number(value) }
          : s
      ),
    }));
  };

  const handleTypeChange = (
    id: string,
    field: keyof ProductType,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      types: prev.types.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    }));
  };

  const addSize = () => {
    setForm((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        { id: crypto.randomUUID(), label: "", price: 0, qty: 0 },
      ],
    }));
  };

  const removeSize = (id: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.id !== id),
    }));
  };

  const addType = () => {
    setForm((prev) => ({
      ...prev,
      types: [
        ...prev.types,
        {
          id: crypto.randomUUID(),
          typeLabel: "",
          imageUrl: "",
          description: "",
        },
      ],
    }));
  };

  const removeType = (id: string) => {
    setForm((prev) => ({
      ...prev,
      types: prev.types.filter((t) => t.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <label className="block font-semibold mb-1">Product Name</label>
      <input
        name="productname"
        placeholder="Product name"
        value={form.productname}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
        required
      />

      <label className="block font-semibold mb-1">Category</label>
      <input
        name="category"
        placeholder="Product category"
        value={form.category}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
        required
      />

      <label htmlFor="kashrut" className="block font-semibold mb-1">
        Kashrut
      </label>
      <select
        name="kashrut"
        value={form.kashrut}
        onChange={handleChange}
        className="bg-white input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        <option value="milky">Milky</option>
        <option value="parev">Parev</option>
        <option value="meaty">Meaty</option>
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
                checked={(form.specialrequirements || []).includes(req)}
                onChange={() =>
                  handleCheckboxChange("specialrequirements", req)
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

      <div className="space-y-2">
        <label className="block font-semibold mb-1">Sizes</label>
        {form.sizes.map((size) => (
          <div key={size.id} className="flex items-center gap-2">
            <input
              placeholder="Label"
              value={size.label}
              onChange={(e) =>
                handleSizeChange(size.id, "label", e.target.value)
              }
              className="border px-2 py-1 rounded w-24"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={size.price}
              onChange={(e) =>
                handleSizeChange(size.id, "price", e.target.value)
              }
              className="border px-2 py-1 rounded w-20"
              required
            />
            {form.sizes.length > 1 && (
              <button
                type="button"
                onClick={() => removeSize(size.id)}
                className="bg-white text-gray-500 px-2 py-1 border rounded hover:text-gray-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="mt-2 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Add Size
        </button>
      </div>

      <div className="space-y-2">
        <label className="block font-semibold mb-1">Types</label>
        {form.types.map((type) => (
          <div key={type.id} className="flex flex-col gap-2 border p-2 rounded">
            <input
              placeholder="Type Label"
              value={type.typeLabel}
              onChange={(e) =>
                handleTypeChange(type.id, "typeLabel", e.target.value)
              }
              className="border px-2 py-1 rounded w-full"
              required
            />
            <input
              placeholder="Image URL"
              value={type.imageUrl}
              onChange={(e) =>
                handleTypeChange(type.id, "imageUrl", e.target.value)
              }
              className="border px-2 py-1 rounded w-full"
            />
            <textarea
              placeholder="Description"
              value={type.description}
              onChange={(e) =>
                handleTypeChange(type.id, "description", e.target.value)
              }
              className="border px-2 py-1 rounded w-full"
            />
            {form.types.length > 1 && (
              <button
                type="button"
                onClick={() => removeType(type.id)}
                className="bg-white text-gray-500 px-2 py-1 border rounded hover:text-gray-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addType}
          className="mt-2 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Add Type
        </button>
      </div>

      <div className="flex flex-row gap-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full mt-6 bg-gray-300 text-white shadow-sm py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-primary text-white shadow-sm py-2 rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Update Product"}
        </button>
      </div>
    </form>
  );
}
