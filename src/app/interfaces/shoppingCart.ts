export interface ShoppingCartItem {
  fUserId: number;
  fCartItemId: number;
  fItemType: string;
  fItemId: number;
  fPrice: number;
  fQuantity: number;
  fItemName: string;
  fSingleImage: string;
  fSellerName: string | null;
  fSpecification: string | null;
  selected?: boolean | null;
  fProductStock?: number | null;
}

export interface Seller {
  name: string;
  selected?: boolean; //全選賣家
  products: ShoppingCartItem[];
}

export interface addProductToCart {
  fItemType: string;
  fItemId: number;
  fPrice: number;
  fQuantity: number;
}
