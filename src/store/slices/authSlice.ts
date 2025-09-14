
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
}

const STORAGE_KEY = "shop_ease_user_v1";

function loadUserFromStorage(): AuthUser | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

const initialState: AuthState = {
  user: loadUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      saveUserToStorage(action.payload);
    },
    logout: (state) => {
      state.user = null;
      saveUserToStorage(null);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
