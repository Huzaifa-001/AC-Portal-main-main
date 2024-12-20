export interface CreditMemoLineItemDto {
  description: string; // Description of the item or service
  quantity: number; // Quantity of the item
  unitPrice: number; // Price per unit
  totalPrice: number; // Total price for the item (quantity * unitPrice)
}

export interface CreditMemoDto {
  creditMemoNumber: string; // Unique identifier for the Credit Memo
  relatedRecords: string[]; // List of IDs or references to related records (e.g., Invoice IDs)
  status: string; // Current status of the Credit Memo (e.g., Open, Applied, Closed)
  total: number; // Total amount of the Credit Memo
  creditMemoDate: Date; // Creation date of the Credit Memo
  dateUpdated: Date; // Last modification date
  lineItems: CreditMemoLineItemDto[]; // List of items in the Credit Memo

}
export interface CreditMemoDto {
  creditMemoNumber: string;
  relatedRecords: string[];
  status: string;
  total: number;
  creditMemoDate: Date;
  dateUpdated: Date;
  lineItems: CreditMemoLineItemDto[];
  internalNote?: string;  // Optional field
}
