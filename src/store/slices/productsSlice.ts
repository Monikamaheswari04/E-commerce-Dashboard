
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface ProductsState {
  list: Product[];
  searchQuery: string;
  filterBrand: string;
  sortPrice: string; // "All" | "Low-High" | "High-Low"
}

const initialState: ProductsState = {
  list: [],
  searchQuery: "",
  filterBrand: "All",
  sortPrice: "All",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.list = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilterBrand(state, action: PayloadAction<string>) {
      state.filterBrand = action.payload;
    },
    setSortPrice(state, action: PayloadAction<string>) {
      state.sortPrice = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = "";
      state.filterBrand = "All";
      state.sortPrice = "All";
    },
  },
});

export const {
  setProducts,
  setSearchQuery,
  setFilterBrand,
  setSortPrice,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
