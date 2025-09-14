

"use client";

import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const { width, height } = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {mounted && width && height && (
        <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />
      )}

      <div className="p-6 text-center mt-20 max-w-xl">
        <h2 className="text-3xl font-bold mb-4 text-green-600">
          🎉 Thank You for Your Purchase!
        </h2>
        <p className="mb-6 text-lg text-gray-700">
          Your order has been successfully confirmed.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

