

"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { cancelOrder } from "@/store/slices/ordersSlice";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const orders = useAppSelector((s) => s.orders.orders);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [exp, setExp] = useState<string | null>(null);

  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const userOrders = user?.email
    ? orders.filter((o) => o.customer.email === user.email)
    : [];

  if (!userOrders || userOrders.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <p className="text-gray-600">You have no orders yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {userOrders.map((order, idx) => (
        <div key={`${order.id}-${idx}`} className="bg-white rounded shadow p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              {/* First product image */}
              <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded overflow-hidden flex-shrink-0">
                <img
                  src={order.items[0]?.image}
                  alt={order.items[0]?.name}
                  className="object-contain max-h-full"
                />
              </div>

              <div className="flex-1">
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-sm text-gray-500">
                  Placed: {new Date(order.date).toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  Items: {order.items.length} • Total: ₹{order.total}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Buyer: {order.customer.name}, {order.customer.phone ?? ""}
                </div>
                <div className="text-sm text-gray-500">
                  Delivery: {order.customer.address}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 md:mt-0">
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="text-orange-600 text-sm hover:underline"
                >
                  Track
                </button>

                {order.status === "Order Placed" && (
                  <button
                    onClick={() => dispatch(cancelOrder({ id: order.id }))}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expand to show items */}
          <div className="mt-3">
            <button
              onClick={() => setExp(exp === order.id ? null : order.id)}
              className="text-sm text-gray-500 hover:underline"
            >
              {exp === order.id ? "Hide items" : "View items"}
            </button>

            {exp === order.id && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {order.items.map((it, idx) => (
                  <div
                    key={`${order.id}-${it.id}-${idx}`}
                    className="flex items-center gap-3 bg-gray-50 p-2 rounded"
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {it.quantity} • ₹{it.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}