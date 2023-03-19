import { Address } from "./user"

export interface OrderToCreate {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: Address;
}

export interface OrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  buyerEmail: string;
  orderDate: string;
  shipToAddress: Address;
  shippingPrice: number;
  deliveryMethod: string;
  orderItems: OrderItem[];
  subtotal: number;
  total: number;
  status: string;
}
