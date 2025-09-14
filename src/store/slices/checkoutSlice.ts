
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cartSlice";

export type Address = {
  name: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
};

export type CheckoutState = {
  items: CartItem[];
  isBuyNow: boolean;
  address?: Address;
};

const initialState: CheckoutState = {
  items: [],
  isBuyNow: false,
  address: undefined,
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutItems: (state, action: PayloadAction<CheckoutState>) => {
      state.items = action.payload.items;
      state.isBuyNow = action.payload.isBuyNow;
      state.address = action.payload.address;
    },
    setCheckoutAddress: (state, action: PayloadAction<Address>) => {
      state.address = action.payload;
    },
    clearCheckout: (state) => {
      state.items = [];
      state.isBuyNow = false;
      state.address = undefined;
    },
  },
});

export const { setCheckoutItems, setCheckoutAddress, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
