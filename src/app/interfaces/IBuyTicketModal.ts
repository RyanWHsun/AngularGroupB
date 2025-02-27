export interface IBuyTicketModal {
  attractionName?: string | null;
  attractionDescription?: string | null;
  attractionTicketId?:number[] | null;
  attractionTicketType?: string[] | null;
  attractionTicketPrice?: number[] | null;
  attractionTicketQuantity?: number | 0;
  imageSrc?: string | null;
}
