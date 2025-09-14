
"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import ProductCard from "@/components/ProductCard";
import { setFilterBrand, setSortPrice } from "@/store/slices/productsSlice";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products.list);
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const { searchQuery, filterBrand, sortPrice } = useAppSelector(
    (s) => s.products
  );

  if (!slug) return <p className="p-6 text-gray-600">Category not found.</p>;

  // Filter products by category
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === slug.toLowerCase()
  );

  // Unique brands for this category
  const brands = useMemo(
    () => ["All", ...Array.from(new Set(categoryProducts.map((p) => p.brand)))],
    [categoryProducts]
  );

  // Filter products based on search, brand, price
  let filtered = categoryProducts
    .filter((p) =>
      p.name.toLowerCase().includes((searchQuery || "").toLowerCase().trim())
    )
    .filter((p) => (filterBrand === "All" ? true : p.brand === filterBrand));

  if (sortPrice === "Low-High") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortPrice === "High-Low") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 capitalize">{slug} Products</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        {/* Brand Filter */}
        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">Brand</label>
          <select
            value={filterBrand || "All"}
            onChange={(e) => dispatch(setFilterBrand(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">Price</label>
          <select
            value={sortPrice || "All"}
            onChange={(e) => dispatch(setSortPrice(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option>All</option>
            <option>Low-High</option>
            <option>High-Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWished={wishlistItems.some((w) => w.id === p.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products available in this category.</p>
      )}
    </div>
  );
}