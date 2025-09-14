
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { statusFlow, updateOrderStatus } from "@/store/slices/ordersSlice";

export default function OrderTrackingPage() {
{
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const order = useAppSelector((s) => s.orders.orders.find((o) => o.id === id));
  const [autoRunning, setAutoRunning] = useState(false);

  useEffect(() => {
    
    if (!order) return;
    
    if (order.status === "Delivered" || order.status === "Cancelled") return;

    setAutoRunning(true);
    const iv = setInterval(() => {
      
      dispatch(updateOrderStatus({ id: order.id, order: { ...order } }));
    }, 5000);

    return () => {
      clearInterval(iv);
      setAutoRunning(false);
    };
  }, [order, dispatch]);

  if (!order) {
    return (
      <div className="p-6 bg-white rounded-lg shadow max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Order Tracking</h1>
        <p className="text-gray-600">Order not found.</p>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(order.status);

  const friendlyHistory = useMemo(
    () =>
      order.history.map((h) => ({
        status: h.status,
        time: new Date(h.time).toLocaleString(),
        location: h.location ?? "",
      })),
    [order.history]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-2">Order #{order.id}</h1>
        <div className="text-sm text-gray-600 mb-4">Placed: {new Date(order.date).toLocaleString()}</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="col-span-2 space-y-3">
            <h3 className="font-semibold">Items</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <div className="font-semibold">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          {/* Status / Summary */}
          <div className="flex flex-col justify-start gap-3">
            <div>
              <p><span className="font-semibold">Total:</span> ₹{order.total}</p>
              <p><span className="font-semibold">Status:</span> {order.status}</p>
              <p className="text-sm text-gray-500 mt-2"><span className="font-semibold">Deliver to:</span> {order.customer.name}</p>
              <p className="text-sm text-gray-500">{order.customer.address}</p>
            </div>

            <div className="mt-2">
              <h3 className="font-semibold mb-2">Tracking</h3>
              <div className="space-y-3">
                {statusFlow
                  .filter((s) => s !== "Cancelled") 
                  .map((status, idx) => {
                    const done = idx <= currentStatusIndex;
                    return (
                      <div key={status} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${done ? "bg-green-600" : "bg-gray-300"}`}></div>
                          {idx < statusFlow.length - 2 && <div className={`w-px h-8 ${done ? "bg-green-600" : "bg-gray-300"}`} />}
                        </div>

                        <div>
                          <div className={`${done ? "text-gray-900" : "text-gray-500"} font-medium`}>{status}</div>
                          {/* find time from history */}
                          {done && (
                            <div className="text-xs text-gray-500">
                              {(() => {
                                const rec = order.history.find((r) => r.status === status);
                                return rec ? `${new Date(rec.time).toLocaleString()}${rec.location ? ` • ${rec.location}` : ""}` : "";
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => alert("Auto-tracker is running while you view this page. For demo, status advances every 5s.")}
                className="text-sm text-gray-500 hover:underline"
              >
                Auto-update: {autoRunning ? "ON (5s)" : "OFF"}
              </button>
            </div>
          </div>
        </div>

        {/* History timeline (detailed) */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">History</h3>
          <ul className="space-y-2">
            {friendlyHistory.map((h, i) => (
              <li key={i} className="text-sm text-gray-600">
                <span className="font-medium">{h.status}</span> — {h.time} {h.location ? ` • ${h.location}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
}
