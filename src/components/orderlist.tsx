
"use client";

import React from "react";
import { useAppSelector } from "./hooks";
import type { Order } from "@/types/index";  

const OrderList: React.FC = () => {
  const orders = useAppSelector((state) => state.orders.orders); 

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order: Order) => (
            <li
              key={String(order.id)} 
              className="border p-3 rounded-lg shadow-sm bg-white"
            >
              <p className="font-semibold">🆔 Order ID: {order.id}</p>
              <p className="text-sm text-gray-600">📌 Status: {order.status}</p>
              <p className="text-sm text-gray-800 font-medium">
                💰 Total: ₹{order.total}
              </p>

              {/* Show order items */}
              {order.items && order.items.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {order.items.map((item) => (
                    <li
                      key={String(item.id)} 
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
