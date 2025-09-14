
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
}

const GUEST_KEY = "shop_ease_wishlist_guest_v1";
const PREFIX = "shop_ease_wishlist_";

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

function wishlistKeyForCurrentUser(): string {
  const email = getEmailFromStorage();
  return email ? `${PREFIX}${email}` : GUEST_KEY;
}

function loadWishlistFromStorage(): Product[] {
  try {
    if (typeof window === "undefined") return [];
    const key = wishlistKeyForCurrentUser();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

function saveWishlistToStorage(items: Product[]) {
  if (typeof window === "undefined") return;
  const key = wishlistKeyForCurrentUser();
  localStorage.setItem(key, JSON.stringify(items));
}

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(
        (item) => String(item.id) === String(action.payload.id)
      );
      if (!exists) {
        state.items.push(action.payload);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string | number>) => {
      const idStr = String(action.payload);
      state.items = state.items.filter((item) => String(item.id) !== idStr);
      saveWishlistToStorage(state.items);
      console.log(
        `[wishlistSlice] removeFromWishlist id=${idStr} (after=${state.items.length})`
      );
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const idStr = String(action.payload.id);
      const exists = state.items.find((item) => String(item.id) === idStr);
      if (exists) {
        state.items = state.items.filter((item) => String(item.id) !== idStr);
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
