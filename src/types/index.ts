

export interface Product {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  stock:number;
  category:string;
  quantity?:number;
  originalPrice?: number;
  sold?: number; 
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: number | string;
  date: string;
  status: string;
  items: OrderItem[];
  total: number;
}
