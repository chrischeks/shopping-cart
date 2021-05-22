export interface Cart {
  userId: string;
  productId: string;
  quantity: number;
  name?: string;
  sellingPrice?: number;
  totalPrice?: number;
  colour?: string;
  size?: string;
}

export interface UserAndProductId {
  userId: string;
  productId: string;
}
