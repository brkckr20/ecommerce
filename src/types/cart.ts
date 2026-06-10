export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  slug: string;
  variantId?: string;
}
