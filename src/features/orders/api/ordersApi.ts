import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Order,
  OrdersQuery,
  OrdersResponse,
  OrderStatus,
  UpdateOrderStatusResponse,
} from "../types/types";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/orders",
    credentials: "include",
  }),
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    getMyOrders: builder.query<OrdersResponse, OrdersQuery | void>({
      query: (params) => ({
        url: "/mine",
        params: params ?? {},
      }),
      providesTags: (result) => [
        { type: "Orders", id: "MINE" },
        ...(result?.orders ?? []).map(({ id }) => ({
          type: "Order" as const,
          id,
        })),
      ],
    }),

    getAllOrders: builder.query<OrdersResponse, OrdersQuery>({
      query: (params) => ({
        url: "/admin",
        params,
      }),
      providesTags: (result) => [
        { type: "Orders", id: "ADMIN" },
        ...(result?.orders ?? []).map(({ id }) => ({
          type: "Order" as const,
          id,
        })),
      ],
    }),

    getAdminOrder: builder.query<Order, string>({
      query: (orderId) => `/admin/${orderId}`,
      providesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    updateOrderStatus: builder.mutation<
      UpdateOrderStatusResponse,
      { orderId: string; status: OrderStatus }
    >({
      query: ({ orderId, status }) => ({
        url: `/admin/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Orders", id: "ADMIN" },
        { type: "Orders", id: "MINE" },
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetAdminOrderQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
