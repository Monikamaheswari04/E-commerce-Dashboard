

"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/store/slices/ordersSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { clearCheckout } from "@/store/slices/checkoutSlice";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const { items, address, isBuyNow } = useAppSelector((s) => s.checkout);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">No items to pay for.</p>
      </div>
    );
  }

  const totalAmount = items.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0
  );

  const handlePayment = () => {
    const orderId = Date.now().toString();

    
    dispatch(
  placeOrder({
    id: orderId,
    items,
    total: totalAmount,
    customer: {
      name: address!.name,
      phone: address!.phone,
      email: user?.email ?? "guest",
      address: `${address!.street}, ${address!.city} - ${address!.pincode}`,
      payment: paymentMethod,
    },
    isBuyNow,
  })
);

    toast.success("Payment successful!");

    
    if (!isBuyNow) {
      dispatch(clearCart());
    }

    
    dispatch(clearCheckout());

    router.push("/order-confirmation");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-center gap-8 mb-8 text-sm font-medium">
        <span className="text-green-600">1. Review</span>
        <span className="text-orange-600">2. Payment</span>
        <span className="text-gray-400">3. Confirmation</span>
      </div>

      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-2xl font-bold mb-4">Choose Payment Method</h2>

        <div className="space-y-4">
          {["UPI", "Card", "Cash on Delivery"].map((method) => (
            <label
              key={method}
              className="flex items-center gap-3 border p-3 rounded cursor-pointer hover:border-orange-500"
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>
                {method === "UPI"
                  ? "UPI (Google Pay, PhonePe, Paytm)"
                  : method === "Card"
                  ? "Credit / Debit Card"
                  : "Cash on Delivery"}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            <strong>Total:</strong> ₹{totalAmount}
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Pay ₹{totalAmount} & Confirm Order
        </button>
      </div>
    </div>
  );
}