export interface InvoiceDto {
  InvoiceNumber: string;
  createdBy: string;
  dateInvoice: Date;
  dateCreated: Date;
  SyncedToQB: boolean;
  DueDate: Date;
  notes: string;
  Total: number;
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
