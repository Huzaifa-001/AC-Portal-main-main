export interface MaterialOrderDto {
  materialOrderNumber: string;
  createdBy: string;
  dateBudget: Date;
  dateCreated: Date;
  notes: string;
  status: string;
  related: string;
  lineItems: LineItemDto[];
}

export interface LineItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
