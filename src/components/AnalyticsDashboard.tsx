
"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/components/hooks";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsDashboard() {
  const orders = useAppSelector((s) => s.orders.orders);
  const products = useAppSelector((s) => s.products.list);

  // Summary Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => {
    return (
      sum +
      o.items.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.id);
        return acc + (product?.price || 0) * item.quantity;
      }, 0)
    );
  }, 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Top 5 Products
  const topProducts = useMemo(() => {
    return products
      .map((p) => {
        const qtySold = orders.reduce((acc, o) => {
          const item = o.items.find((i) => i.id === p.id);
          return acc + (item?.quantity ?? 0);
        }, 0);
        return { ...p, qtySold };
      })
      .sort((a, b) => b.qtySold - a.qtySold)
      .slice(0, 5);
  }, [products, orders]);

  // Revenue by Category
  const revenueByCategory = useMemo(() => {
    const catMap: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          catMap[product.category] = (catMap[product.category] || 0) + item.quantity * product.price;
        }
      });
    });
    return Object.entries(catMap).map(([category, revenue]) => ({ category, revenue }));
  }, [orders, products]);

  // Revenue & Orders Over Time
  const revenueOverTime = useMemo(() => {
    const dateMap: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach((o) => {
      const date = dayjs(o.date).format("YYYY-MM-DD");
      if (!dateMap[date]) dateMap[date] = { revenue: 0, orders: 0 };
      const orderRevenue = o.items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);
      dateMap[date].revenue += orderRevenue;
      dateMap[date].orders += 1;
    });
    const sortedDates = Object.keys(dateMap).sort();
    return {
      labels: sortedDates,
      revenue: sortedDates.map((d) => dateMap[d].revenue),
      orders: sortedDates.map((d) => dateMap[d].orders),
    };
  }, [orders, products]);

  // Chart.js Data
  const topProductsData = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: "Quantity Sold",
        data: topProducts.map((p) => p.qtySold),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  const revenueByCategoryData = {
    labels: revenueByCategory.map((r) => r.category),
    datasets: [
      {
        label: "Revenue",
        data: revenueByCategory.map((r) => r.revenue),
        backgroundColor: ["#4F46E5", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"],
      },
    ],
  };

  const revenueOverTimeData = {
    labels: revenueOverTime.labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueOverTime.revenue,
        borderColor: "#4F46E5",
        backgroundColor: "#4F46E5",
        yAxisID: "yRevenue",
      },
      {
        label: "Orders",
        data: revenueOverTime.orders,
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        yAxisID: "yOrders",
      },
    ],
  };

  // Correctly typed options for line chart without 'id' on scales
  const revenueOverTimeOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      yRevenue: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Revenue" },
      },
      yOrders: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Orders" },
      },
    },
  };

  return (
    <div className="p-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Summary Cards */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-500">Total Orders</h3>
        <p className="text-2xl font-bold">{totalOrders}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-500">Total Revenue</h3>
        <p className="text-2xl font-bold">₹{totalRevenue}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-500">Avg. Order Value</h3>
        <p className="text-2xl font-bold">₹{avgOrderValue.toFixed(2)}</p>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow md:col-span-1 lg:col-span-1">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <Bar data={topProductsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow md:col-span-1 lg:col-span-1">
        <h2 className="text-lg font-semibold mb-4">Revenue by Category</h2>
        <Pie data={revenueByCategoryData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow md:col-span-2 lg:col-span-3">
        <h2 className="text-lg font-semibold mb-4">Revenue & Orders Over Time</h2>
        <Line data={revenueOverTimeData} options={revenueOverTimeOptions} />
      </div>
    </div>
  );
}
