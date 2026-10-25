import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CustomerProfile,
  CheckoutRequest,
  CheckoutResponse,
  Order,
} from "../types/types";
import { cartApi } from "../../cart/api/cartApi";

export const checkoutApi = createApi({
  reducerPath: "checkoutApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    credentials: "include",
  }),
  tagTypes: ["Profile", "Order"],
  endpoints: (builder) => ({
    getProfile: builder.query<CustomerProfile, void>({
      query: () => "users/user",
      providesTags: ["Profile"],
    }),

    createOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: "checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        } catch {
          // If checkout fails, leave the cart unchanged.
        }
      },
    }),

    getOrder: builder.query<Order, string>({
      query: (orderId) => `checkout/${orderId}`,
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetProfileQuery, useCreateOrderMutation, useGetOrderQuery } =
  checkoutApi;
