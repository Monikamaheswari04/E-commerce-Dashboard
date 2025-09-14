
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";
import type { RootState } from "../store";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const GUEST_KEY = "shop_ease_cart_guest_v1";
const PREFIX = "shop_ease_cart_"; 

function getEmailFromStorage(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("shop_ease_user_v1");
    if (!raw) return null;
    const u = JSON.parse(raw) as { email?: string };
    return u?.email ?? null;
  } catch {
    return null;
  }
}

function cartKeyForCurrentUser(): string {
  const email = getEmailFromStorage();
  return email ? `${PREFIX}${email}` : GUEST_KEY;
}

function loadCartFromStorage(): CartItem[] {
  try {
    if (typeof window === "undefined") return [];
    const key = cartKeyForCurrentUser();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  const key = cartKeyForCurrentUser();
  localStorage.setItem(key, JSON.stringify(items));
}

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => String(i.id) === String(action.payload.id));
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter((i) => String(i.id) !== String(action.payload));
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number | string; quantity: number }>
    ) => {
      const item = state.items.find((i) => String(i.id) === String(action.payload.id));
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    // remove a set of item ids (used after checkout to remove purchased items)
    removeItemsByIds: (state, action: PayloadAction<Array<number | string>>) => {
      const ids = action.payload.map(String);
      state.items = state.items.filter((i) => !ids.includes(String(i.id)));
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, removeItemsByIds } =
  cartSlice.actions;

export default cartSlice.reducer;
