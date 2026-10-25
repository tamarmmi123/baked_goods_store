import React from "react";
import type { Product } from "../types/types";
import { ChevronDown } from "lucide-react";

type ProductFilterProps = {
  products: Product[];
  selectedKashrut: string[];
  onKashrutChange: (value: string[]) => void;
  selectedTypes: string[];
  onTypesChange: (value: string[]) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  selectedRequirements: string[];
  onRequirementsChange: (value: string[]) => void;
};

const ProductFilter: React.FC<ProductFilterProps> = ({
  products,
  selectedKashrut,
  onKashrutChange,
  selectedTypes,
  onTypesChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  selectedRequirements,
  onRequirementsChange,
}) => {
  const kashrutOptions = [...new Set(products.map((p) => p.kashrut))];

  const typeOptions = [
    ...new Map(
      products
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category))
        .map((category) => [category.toLowerCase(), category]),
    ).values(),
  ].sort((a, b) => a.localeCompare(b));

  const requirementOptions = [
    ...new Set(products.flatMap((p) => p.specialrequirements ?? [])),
  ].sort();

  const toggleValue = (
    value: string,
    selected: string[],
    onChange: (values: string[]) => void,
  ) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 rounded-xl border border-gray-200 bg-white p-5 h-fit">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          type="button"
          onClick={() => {
            onKashrutChange([]);
            onTypesChange([]);
            onMinPriceChange("");
            onMaxPriceChange("");
            onRequirementsChange([]);
          }}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-5">
        {/* Kashrut multi-select dropdown */}
        <details className="group border-b border-gray-100 pb-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
            Milky · Parve
            <span className="flex items-center gap-2 text-gray-500">
              {selectedKashrut.length > 0 && `(${selectedKashrut.length})`}
              <ChevronDown
                size={16}
                className="transition-transform group-open:rotate-180"
              />
            </span>
          </summary>

          <div className="mt-3 space-y-2">
            {kashrutOptions.map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedKashrut.includes(value)}
                  onChange={() =>
                    onKashrutChange(
                      selectedKashrut.includes(value)
                        ? selectedKashrut.filter((item) => item !== value)
                        : [...selectedKashrut, value],
                    )
                  }
                  className="rounded"
                />
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </label>
            ))}
          </div>
        </details>

        {/* Food type multi-select dropdown */}
        <details className="group border-b border-gray-100 pb-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
            Food type
            <span className="flex items-center gap-2 text-gray-500">
              {selectedTypes.length > 0 && `(${selectedTypes.length})`}
              <ChevronDown
                size={16}
                className="transition-transform group-open:rotate-180"
              />
            </span>
          </summary>
          <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
            {typeOptions.map((type) => (
              <label key={type.toLowerCase()} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() =>
                    toggleValue(type, selectedTypes, onTypesChange)
                  }
                  className="rounded"
                />
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
              </label>
            ))}
            {typeOptions.length === 0 && (
              <p className="text-sm text-gray-500">No types available</p>
            )}
          </div>
        </details>

        {/* Price range */}
        <details className="group border-b border-gray-100 pb-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
            Price range
            <ChevronDown
              size={16}
              className="text-gray-500 transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min ₪"
              aria-label="Minimum price"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 p-2 text-sm"
            />
            <input
              type="number"
              min="0"
              placeholder="Max ₪"
              aria-label="Maximum price"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 p-2 text-sm"
            />
          </div>
        </details>

        {/* Special requirements multi-select dropdown */}
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
            Special requirements
            <span className="flex items-center gap-2 text-gray-500">
              {selectedRequirements.length > 0 &&
                `(${selectedRequirements.length})`}
              <ChevronDown
                size={16}
                className="transition-transform group-open:rotate-180"
              />
            </span>
          </summary>
          <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
            {requirementOptions.map((requirement) => (
              <label
                key={requirement}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedRequirements.includes(requirement)}
                  onChange={() =>
                    toggleValue(
                      requirement,
                      selectedRequirements,
                      onRequirementsChange,
                    )
                  }
                  className="rounded"
                />
                {requirement}
              </label>
            ))}
            {requirementOptions.length === 0 && (
              <p className="text-sm text-gray-500">No requirements available</p>
            )}
          </div>
        </details>
      </div>
    </aside>
  );
};

export default ProductFilter;
