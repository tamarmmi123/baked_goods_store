
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Cart, CartItem } from "../types/types";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/cart",
    credentials: "include",
  }),
  tagTypes: ["Cart"],

  endpoints: (builder) => ({
    getActiveCart: builder.query<Cart, string>({
      query: (userId) => `/${userId}`,
      providesTags: ["Cart"],
    }),

    addItem: builder.mutation<
      CartItem,
      {
        cart_id: string;
        product_id: string;
        size_id: string;
        type_id: string;
        quantity: number;
      }
    >({
      query: ({ cart_id, ...body }) => ({
        url: `/${cart_id}/items`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateItem: builder.mutation<
      CartItem,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/items/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeItem: builder.mutation<{ success: boolean }, string>({
      query: (itemId) => ({
        url: `/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    checkout: builder.mutation<Cart, string>({
      query: (cartId) => ({
        url: `/checkout/${cartId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetActiveCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useCheckoutMutation,
} = cartApi;