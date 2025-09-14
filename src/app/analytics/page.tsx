
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/components/hooks";
import { setProducts } from "@/store/slices/productsSlice";
import { products as allProducts } from "@/data/products";
import dynamic from "next/dynamic";

const AnalyticsDashboard = dynamic(
  () => import("@/components/AnalyticsDashboard"),
  { ssr: false }
);

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setProducts(allProducts)); 
  }, [dispatch]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <AnalyticsDashboard />
    </main>
  );
}