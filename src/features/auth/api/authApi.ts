import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginPayload, RegisterPayload, User } from "../types/types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include", 
  }),
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginPayload>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<User, RegisterPayload>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => "/users/user",
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
