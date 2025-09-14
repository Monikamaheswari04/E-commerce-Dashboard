
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAppSelector, useAppDispatch } from "./hooks";
import { setSearchQuery } from "@/store/slices/productsSlice";
import { logout } from "@/store/slices/authSlice";
import { categories } from "@/data/categories";

import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingCart,
  LogIn,
  UserPlus,
  Package,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchQuery = useAppSelector((s) => s.products.searchQuery);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((acc, it) => acc + it.quantity, 0)
  );
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);
  const user = useAppSelector((s) => s.auth.user);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* 🔹 Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu toggle */}
          <button className="p-2 rounded hover:bg-gray-100 md:hidden">
            <Menu size={20} />
          </button>

          <Link
            href="/"
            className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-800"
          >
            ShopEase
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden sm:flex flex-1 items-center max-w-lg">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full">
            <Search size={16} className="text-gray-500" />
            <input
              className="bg-transparent ml-2 outline-none w-full text-sm"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
        </div>

        {/* Right: Nav Buttons */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Profile */}
          <button
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded hover:bg-gray-50"
            onClick={() => setProfileOpen((p) => !p)}
          >
            <User size={20} />
            <span className="hidden md:inline text-sm">Profile</span>
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded hover:bg-gray-50"
          >
            <Heart size={20} />
            <span className="hidden md:inline text-sm">Wishlist</span>
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] sm:text-xs font-semibold px-1 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded hover:bg-gray-50"
          >
            <ShoppingCart size={20} />
            <span className="hidden md:inline text-sm">Cart</span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] sm:text-xs font-semibold px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* 🔹 Profile Dropdown */}
      {profileOpen && (
        <div className="absolute right-3 sm:right-6 top-14 bg-white border shadow-lg rounded-md w-48 sm:w-56">
          <div className="flex flex-col">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="group flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <LogIn
                    size={16}
                    className="text-gray-500 group-hover:text-orange-500"
                  />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="group flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <UserPlus
                    size={16}
                    className="text-gray-500 group-hover:text-orange-500"
                  />
                  New user? Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm truncate">
                  <User size={16} className="text-gray-500" /> Hello,{" "}
                  {user.name}
                </span>

                <Link
                  href="/orders"
                  className="group flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <Package
                    size={16}
                    className="text-gray-500 group-hover:text-orange-500"
                  />
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    dispatch(logout());
                    router.push("/");
                    toast.success("Logged out successfully");
                  }}
                  className="group flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  <LogOut
                    size={16}
                    className="text-gray-500 group-hover:text-orange-500"
                  />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Category Strip */}
<div className="bg-white border-t">
  <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center gap-6 overflow-x-auto scrollbar-hide">
    {categories.map((category) => (
      <Link
        key={category.name}
        href={`/category/${category.name.toLowerCase()}`}
        className="flex flex-col items-center gap-1 min-w-[64px] sm:min-w-[80px]"
      >
        <div className="flex flex-col items-center">
          <img
            src={category.image}
            alt={category.name}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"

          />
        </div>
        <span className="text-xs sm:text-sm md:text-base text-gray-700 text-center">
          {category.name}
        </span>
      </Link>
    ))}
  </div>
</div>

      {/* 🔹 Mobile Search (visible only on small screens) */}
      <div className="sm:hidden border-t bg-white px-3 py-2">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full">
          <Search size={16} className="text-gray-500" />
          <input
            className="bg-transparent ml-2 outline-none w-full text-sm"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      </div>
    </header>
  );
}
