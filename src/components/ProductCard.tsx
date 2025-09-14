
"use client";

import React from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/components/hooks";
import { addToCart, CartItem } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { Product } from "@/types/index";
import toast from "react-hot-toast";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  isWished?: boolean;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const cartItems = useAppSelector((s) => s.cart.items);

  const isWished = wishlistItems.some((item) => item.id === product.id);
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      const cartItem: CartItem = { ...product, quantity: 1 };
      dispatch(addToCart(cartItem));
      toast.success(`${product.name} added to cart`);
    } else {
      router.push("/cart");
    }
  };

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${product.id}`);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast.success(
      isWished
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-2 right-2 z-20 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
      >
        <Heart
          size={18}
          className={`transition-transform duration-200 ${
            isWished
              ? "fill-red-500 text-red-500 scale-110"
              : "text-gray-500"
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-44 mb-3 flex items-center justify-center overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-contain p-2 z-10"
          priority
        />
      </div>

      {/* Info */}
      <h3 className="font-semibold line-clamp-2 h-12 text-gray-800">
        {product.name}
      </h3>
      <p className="text-gray-700 mt-1 font-medium">₹{product.price}</p>
      <p className="text-xs text-gray-500">{product.brand}</p>

      {/* Rating */}
      <div className="flex items-center text-yellow-500 text-sm mt-1">
        ⭐ {Math.floor(Math.random() * 2) + 4}.0 / 5
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2 pt-3">
        <button
          onClick={handleAddToCart}
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
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition"
        >
          <Zap size={16} /> Buy Now
        </button>
      </div>
    </div>
  );
}
