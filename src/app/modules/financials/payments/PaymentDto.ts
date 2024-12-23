export interface PaymentDto {
  paymentId: number;
  createdBy: string;
  paymentDate: Date;
  paymentMethod: string;
  refrenceNumber: string;
  totalAmount: number;
  dateCreated: Date;
  dateUpdated: Date;
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
