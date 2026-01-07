import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";
import { authApi } from "../api/authApi";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
        }
      )
      .addMatcher(
        authApi.endpoints.getMe.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        }
      )
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
        }
      );
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
