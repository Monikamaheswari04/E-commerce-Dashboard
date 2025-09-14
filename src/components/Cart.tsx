
"use client";
import React from "react";
import { useAppSelector, useAppDispatch } from "./hooks";
import { removeFromCart, clearCart } from "@/store/slices/cartSlice";

export default function CartWidget() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>₹{item.price * item.quantity}</span>
                <button
                  className="text-red-500 ml-2"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-semibold">Total: ₹{total}</p>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
