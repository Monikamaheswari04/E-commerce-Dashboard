# E-commerce Dashboard

A lightweight, demo e-commerce dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS** and **Chart.js**.  
The app includes a product catalog with search & filtering, a shopping cart and checkout flow, order history & tracking, analytics dashboards (charts), and a responsive UI.  

---

## Table of Contents
- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Project structure (high level)](#project-structure-high-level)  
- [Key files & responsibilities](#key-files--responsibilities)  
- [State management & persistence](#state-management--persistence)  
- [Data (mock) & images](#data-mock--images)  
- [Analytics / Charts](#analytics--charts)  
- [How to use (user flows)](#how-to-use-user-flows)  
- [Known issues & TODOs](#known-issues--todos)  
- [Contributing](#contributing)  
- [License & contact](#license--contact)

---

# Project Overview
This project is a demo/full-stack-ish front-end e-commerce dashboard that showcases typical e-commerce flows:  
- Browsing products  
- Adding to wishlist/cart  
- Buy Now checkout  
- Address collection & payment  
- Order confirmation + order tracking (demo auto-updates)  
- Order history per user  
- Analytics dashboard with charts  

The app is built with client components (`"use client"`) and Redux store to manage app state.  

---

# Features
- Product catalog with search, brand filter and price sort  
- Product cards with Add to Cart, Buy Now, and wishlist toggle  
- Shopping cart widget and dedicated Cart page with quantity management  
- Checkout review page (address collection), Payment page (mock payment methods), and Order Confirmation page  
- Orders page + Order Tracking page (auto-advance demo)  
- Analytics dashboard: Top products, revenue by category, and revenue & orders over time charts  
- **Cart, Wishlist, Orders (history), and Address collection are all saved on a per-user basis (by email)**.  
  - If logged in → stored under the user’s email  
  - If not logged in → stored under a “guest” bucket  
- Local persistence via `localStorage`  
- Responsive design with Tailwind  

---

# Tech Stack
- Next.js (App Router) + React (client components)  
- TypeScript  
- Tailwind CSS for styling  
- Redux Toolkit for global state (slices)  
- Chart.js + react-chartjs-2 for analytics charts  
- dayjs for date handling in charts  
- react-hot-toast for notifications  
- bcryptjs (signup password hashing), react-confetti (order confirmation), react-use (window size)  

---

# Getting Started

Prerequisites:
- Node.js v16+ (or latest LTS)  
- npm or yarn  

Install & run locally:
```bash
# install dependencies
npm install

# dev server
npm run dev
# or
yarn dev

# build for production
npm run build
npm run start
```

Everything runs client-side with mock data (`src/data/`). No external API is required.  

---

# Project structure (high level)
```
src/
  app/                 # Next.js app router pages
    products/
    cart/
    checkout/
    orders/
    analytics/
    ... (about, contact, privacy, login, signup)
  components/          # Reusable UI (Navbar, ProductCard, AnalyticsDashboard, CartWidget, OrderList ...)
  data/                # Mock data: products, categories
  store/               # Redux slices & store configuration
  types/               # TypeScript interfaces & types
  globals.css          # Tailwind + custom styles
```

---

# Key files & responsibilities
- `src/app/products/page.tsx` → Product listing with brand filter & price sort  
- `src/components/ProductCard.tsx` → Product card UI with Add to Cart, Buy Now, wishlist toggle  
- `src/app/cart/page.tsx` → Cart page (update quantity, remove items, proceed to checkout)  
- `src/app/checkout/page.tsx` → Checkout review (address collection, supports Buy Now)  
- `src/app/checkout/payment/page.tsx` → Payment page (mock payments, places order, clears checkout)  
- `src/app/orders/page.tsx` → Orders list per user (email-based)  
- `src/app/orders/[id]/page.tsx` → Order tracking timeline (demo auto-advances status)  
- `src/components/AnalyticsDashboard.tsx` → Charts (Bar, Pie, Line) for analytics  
- `src/data/products.ts` → Product mock data  
- `src/data/categories.ts` → Category mock data  
- `src/store/store.ts` → Redux store setup (cart, wishlist, orders, checkout, products, auth)  
- `src/store/slices/*` → State slices (per-user persistence via localStorage)  

---

# State management & persistence
- Redux Toolkit is used for global state.  
- Slices: `cart`, `wishlist`, `orders`, `products`, `checkout`, `auth`.  
- Data is **persisted to localStorage per user email** (separates guest and logged-in users).  
  - Example: `cart_john@example.com` vs `cart_guest`.  

---

# Data (mock)
- `src/data/products.ts` → Array of `Product` objects (id, name, brand, category, price, stock, image path).  
- `src/data/categories.ts` → Array of category names + representative images.  

---

# Analytics / Charts
`AnalyticsDashboard` computes:  
- Total orders, revenue, and average order value  
- Top 5 products by quantity sold  
- Revenue by category  
- Revenue & orders over time (daily/weekly)  

Charts:  
- **Bar** → Top products  
- **Pie** → Revenue by category  
- **Line** → Revenue & orders over time (two y-axes: revenue vs orders)  

---

# How to use — typical user flows
1. **Browse & filter** → Products page with search, brand filter, price sorting  
2. **Wishlist / Cart** → Product cards allow Add to Cart, Buy Now, and Wishlist toggle  
3. **Cart** → Manage quantities, remove items, proceed to checkout  
4. **Checkout** → Review items, enter address (saved per email), continue to payment  
5. **Payment** → Choose payment method, confirm order, see order confirmation (with confetti)  
6. **Orders (history)** → Orders page lists past orders for that user’s email  
7. **Order tracking** → Track an order’s timeline; demo auto-advances statuses  

---

# Notes
- Client-heavy app with `"use client"`  
- Uses localStorage for persistence (per-user email)  
- Analytics update automatically when new orders are placed  
- Chart.js is dynamically imported to avoid SSR issues  

---

