export interface IAttractionTicketShoppingCart{
  fCartId?:number|null,
  fCartItemId?:number|null,
  fUserId?:number|null,
  fTicketId?: number | null;
  fAttractionId?: number | null;
  fAttractionName?: string | null;
  fImageSrc?: string | null;
  fTicketType?: string | null;
  fPrice?: number | null;
  fQuantity?: number | 0;
  fDiscountInformation?: string | null;
  fCreatedDate?: string | null;
}
