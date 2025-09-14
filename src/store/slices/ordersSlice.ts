
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "./cartSlice";

export const statusFlow = [
  "Order Placed",
  "Shipped",
  "Reached Warehouse",
  "Near You",
  "Delivered",
  "Cancelled",
] as const;
export type Status = typeof statusFlow[number];

interface StatusRecord {
  status: Status;
  time: string; 
  location?: string;
}

export interface OrderItem extends CartItem {}

interface Customer {
  name?: string;
  address?: string;
  payment?: string;
  phone?: string;
  email?: string;
}

export interface Order {
  id: string; 
  date: string; 
  items: OrderItem[];
  total: number;
  status: Status;
  customer: Customer;
  history: StatusRecord[];
  isBuyNow?: boolean;
}

interface OrdersState {
  orders: Order[];
}

const LOCAL_KEY = "shop_ease_orders_v1";

function loadOrdersFromStorage(): Order[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function saveOrdersToStorage(orders: Order[]) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(orders));
  } catch {}
}

const initialState: OrdersState = {
  orders: loadOrdersFromStorage(),
};

const getLocationForStatus = (status: Status): string | undefined => {
  switch (status) {
    case "Shipped":
      return "Origin Hub";
    case "Reached Warehouse":
      return "Chennai Warehouse";
    case "Near You":
      return "Local Delivery Center";
    default:
      return undefined;
  }
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: (
      state,
      action: PayloadAction<{
        id: string;               
        items: OrderItem[];
        total: number;
        customer?: Customer;
        isBuyNow?: boolean;
      }>
    ) => {
      const now = new Date().toISOString();
      const initialStatus: Status = "Order Placed";

      const newOrder: Order = {
        id: action.payload.id,   
        date: now,
        items: action.payload.items,
        total: action.payload.total,
        status: initialStatus,
        customer: action.payload.customer ?? {},
        history: [
          {
            status: initialStatus,
            time: now,
            location: getLocationForStatus(initialStatus),
          },
        ],
        isBuyNow: action.payload.isBuyNow ?? false,
      };

      state.orders.unshift(newOrder); 
      saveOrdersToStorage(state.orders);
    },

    setOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Status; payment?: string }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (!order) return;

      order.status = action.payload.status;
      if (action.payload.payment !== undefined) {
        order.customer = {
          ...order.customer,
          payment: action.payload.payment,
        };
      }

      order.history.push({
        status: action.payload.status,
        time: new Date().toISOString(),
        location: getLocationForStatus(action.payload.status),
      });

      saveOrdersToStorage(state.orders);
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; order: Partial<Order>  }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (!order) return;
      if (order.status === "Delivered" || order.status === "Cancelled") return;

      const currentIdx = statusFlow.indexOf(order.status);
      const nextIdx = Math.min(currentIdx + 1, statusFlow.length - 2);
      const nextStatus = statusFlow[nextIdx] as Status;

      order.status = nextStatus;
      order.history.push({
        status: nextStatus,
        time: new Date().toISOString(),
        location: getLocationForStatus(nextStatus),
      });
      saveOrdersToStorage(state.orders);
    },

    cancelOrder: (state, action: PayloadAction<{ id: string }>) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (!order) return;
      if (order.status === "Order Placed") {
        order.status = "Cancelled";
        order.history.push({
          status: "Cancelled",
          time: new Date().toISOString(),
        });
        saveOrdersToStorage(state.orders);
      }
    },

    clearOrders: (state) => {
      state.orders = [];
      saveOrdersToStorage(state.orders);
    },
  },
});

export const {
  placeOrder,
  updateOrderStatus,
  cancelOrder,
  setOrderStatus,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
