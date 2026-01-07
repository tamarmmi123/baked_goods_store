import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../types/types";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
});

const baseQueryWithCredentials = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
});

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery,
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),

    addProduct: builder.mutation<Product, Partial<Product>>({
      async queryFn(product, api, extraOptions) {
        const result = await baseQueryWithCredentials(
          {
            url: "/products",
            method: "POST",
            body: product,
          },
          api,
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as Product };
      },
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }
    >({
      async queryFn({ id, data }, api, extraOptions) {
        const result = await baseQueryWithCredentials(
          {
            url: `/products/${id}`,
            method: "PUT",
            body: data,
          },
          api,
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as Product };
      },
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<void, string>({
      async queryFn(id, api, extraOptions) {
        const result = await baseQueryWithCredentials(
          {
            url: `/products/${id}`,
            method: "DELETE",
          },
          api,
          extraOptions
        );

        if (result.error) {
          return { error: result.error };
        }

        return { data: undefined };
      },
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
