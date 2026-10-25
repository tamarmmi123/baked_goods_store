import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types/types";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addItemLocally: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    removeItemLocally: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
  },
});

export const { setCart, addItemLocally, removeItemLocally } = cartSlice.actions;
export default cartSlice.reducer;