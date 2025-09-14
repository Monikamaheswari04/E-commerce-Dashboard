
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { setProducts } from "@/store/slices/productsSlice";
import { products } from "@/data/products"; // mock data
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { list, searchQuery, filterBrand } = useAppSelector((s) => s.products);

  const [priceFilter, setPriceFilter] = useState("All");

  // load products into redux
  useEffect(() => {
    if (!list || list.length === 0) {
      dispatch(setProducts(products));
    }
  }, [list, dispatch]);

  const brands = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.brand)))],
    []
  );

  // filter + sort
  let filtered = (list || [])
    .filter((p) =>
      p.name.toLowerCase().includes((searchQuery || "").toLowerCase().trim())
    )
    .filter((p) => (filterBrand === "All" ? true : p.brand === filterBrand));

  if (priceFilter === "Low-High") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (priceFilter === "High-Low") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="p-6">
      {/* filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">Brand</label>
          <select
            value={filterBrand}
            onChange={(e) =>
              dispatch({ type: "products/setFilterBrand", payload: e.target.value })
            }
            className="border px-2 py-1 rounded"
          >
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">Price</label>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option>All</option>
            <option>Low-High</option>
            <option>High-Low</option>
          </select>
        </div>
      </div>

      {/* product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}