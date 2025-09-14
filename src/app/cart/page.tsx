

"use client";

import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { updateQuantity, removeFromCart } from "@/store/slices/cartSlice";
import { setCheckoutItems } from "@/store/slices/checkoutSlice";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartPage() {
  const cart = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Save items for checkout, but DO NOT place order yet
    dispatch(setCheckoutItems({ items: cart, isBuyNow: false }));

    router.push("/checkout"); 
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg shadow-sm bg-white flex flex-col relative"
              >
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="relative w-full h-40 mb-3 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <h3 className="font-semibold line-clamp-2 text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.brand}</p>
                <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                    }
                    disabled={item.quantity === 1}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="min-w-[20px] text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 border-t pt-4 gap-4">
            <div className="text-lg font-semibold">Total: ₹{totalAmount}</div>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
            >
              Go to Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}