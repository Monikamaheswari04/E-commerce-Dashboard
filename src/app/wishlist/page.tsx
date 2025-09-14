
"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/components/hooks";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart, CartItem } from "@/store/slices/cartSlice";
import { Trash2, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
   
    return null;
  }

  const handleRemove = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(id));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const alreadyInCart = cartItems.some(
      (item) => String(item.id) === String(product.id)
    );
    if (!alreadyInCart) {
      const cartItem: CartItem = { ...product, quantity: 1 };
      dispatch(addToCart(cartItem));
      toast.success(`${product.name} added to cart`);
    } else {
      router.push("/cart");
    }
  };

  const handleBuyNow = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    router.push(`/checkout?productId=${id}`);
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const isInCart = cartItems.some(
              (cart) => String(cart.id) === String(item.id)
            );

            return (
              <div
                key={String(item.id)}
                className="bg-white border rounded-lg shadow-sm p-4 flex flex-col relative"
              >
                {/* Trash Icon */}
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, item.id)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 text-red-600 z-20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Product Image */}
                <div className="w-full h-40 relative flex items-center justify-center mb-3">
                  <img
                    src={item.image}
                    alt={String(item.name)}
                    className="object-contain max-h-40 pointer-events-none"
                  />
                </div>

                {/* Info */}
                <h2 className="font-semibold text-gray-800 line-clamp-2 mb-1">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-sm">{(item as any).brand}</p>
                <p className="text-orange-600 font-bold mt-2">
                  ₹{(item as any).price}
                </p>

                {/* Actions */}
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, item)}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm transition ${
                      isInCart
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {!isInCart && <ShoppingCart size={16} />}
                    {isInCart ? "Go to Cart" : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleBuyNow(e, item.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    <Zap size={16} /> Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
