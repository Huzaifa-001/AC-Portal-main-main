export interface CreditMemoDto {
  creditMemoNumber: string;
  relatedRecords: string[];
  status: string;
  total: number;
  creditMemoDate: Date;
  dateUpdated: Date;
  lineItems: CreditMemoLineItemDto[];
  internalNote?: string; // Optional field
}

export interface CreditMemoLineItemDto {
  description: string; // Description of the item or service
  quantity: number; // Quantity of the item
  unitPrice: number; // Price per unit
  totalPrice: number; // Total price for the item (quantity * unitPrice)
}
