export interface Product {
  id?: string;
  name: string;
  description: string;
  sku: string;
  sellingPrice: number;
  stockLevel: number;
  expirationDate?: Date;
  imageURL: string;
  colours: any;
  sizes: any;
  categoryId?: string;
}
