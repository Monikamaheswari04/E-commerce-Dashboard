"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/components/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { setCheckoutItems } from "@/store/slices/checkoutSlice";
import Image from "next/image";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function CheckoutPageInner() {
  const cart = useAppSelector((s) => s.cart.items);
  const products = useAppSelector((s) => s.products.list);
  const orders = useAppSelector((s) => s.orders.orders);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [checkoutCart, setCheckoutCart] = useState(cart);
  const [showForm, setShowForm] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (productId) {
      const product = products.find((p) => p.id === Number(productId));
      if (product) setCheckoutCart([{ ...product, quantity: 1 }]);
    } else {
      setCheckoutCart(cart);
    }
  }, [productId, products, cart]);

  useEffect(() => {
    if (user?.email) {
      const lastOrder = orders.find((o) => o.customer.email === user.email);
      if (lastOrder) {
        const fullAddress = lastOrder.customer.address ?? "";
        const [streetPart = "", cityPart = ""] = fullAddress.split(",");
        const [city = "", pin = ""] = cityPart.trim().split(" - ");

        setAddress({
          name: lastOrder.customer.name ?? "",
          phone: lastOrder.customer.phone ?? "",
          street: streetPart.trim(),
          city: city.trim(),
          pincode: pin.trim(),
        });

        setShowForm(false);
      }
    }
  }, [user, orders]);

  const totalAmount = checkoutCart.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0
  );

  const handleContinueToPayment = () => {
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      toast.error("Please fill all address fields");
      return;
    }

    dispatch(setCheckoutItems({ items: checkoutCart, isBuyNow: Boolean(productId), address }));
    router.push("/checkout/payment");
  };

  if (!hydrated) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-center gap-8 mb-8 text-sm font-medium">
        <span className="text-green-600">1. Review</span>
        <span className="text-gray-400">2. Payment</span>
        <span className="text-gray-400">3. Confirmation</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Order Summary + Address */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white shadow rounded-xl p-5 border">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {checkoutCart.map((item) => (
              <div key={item.id.toString()} className="flex gap-4 border-b pb-4 mb-4">
                <div className="w-28 h-28 relative flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Sold by: {item.brand}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <span className="text-orange-600 font-bold text-lg">
                    ₹{Number(item.price) * Number(item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="bg-white shadow rounded-xl p-5 border">
            <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
            {!showForm ? (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-lg">{address.name}</p>
                <p>{address.street}, {address.city} - {address.pincode}</p>
                <p className="flex items-center gap-2">📞 {address.phone}</p>
                <button onClick={() => setShowForm(true)} className="text-sm text-orange-600 hover:underline">
                  Change
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Phone Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Street Address" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="border p-2 rounded col-span-2" />
                <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="border p-2 rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Price Details */}
        <div className="bg-white shadow rounded-xl p-5 border h-fit">
          <h2 className="text-2xl font-bold mb-4">Price Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-bold text-lg">
              <span>Order Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
          <button onClick={handleContinueToPayment} className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
