

"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  
  const showNavbar =
    pathname === "/" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/category");

  return (
    <body className="bg-gray-50 text-gray-900">
      <Provider store={store}>
        {showNavbar && <Navbar />}

        <main className="min-h-[calc(100vh-64px)] pt-4 px-4 md:px-8 max-w-7xl mx-auto">
          {children}
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontSize: "14px", borderRadius: "8px" },
            success: { style: { background: "#d1fae5", color: "#065f46" } },
            error: { style: { background: "#fee2e2", color: "#991b1b" } },
          }}
        />
      </Provider>
      <Footer />
    </body>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><LayoutContent>{children}</LayoutContent></html>;
}
