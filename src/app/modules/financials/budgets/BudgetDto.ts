export interface BudgetDto {
  budgetNumber: string;
  createdBy: string;
  dateBudget: Date;
  dateCreated: Date;
  grossProfit: number;
  netProfit: number;
  salesRep: 'Rep A';
  salesRepImage: 'rep-a.jpg';
  related: string;
  lineItems: LineItemDto[];
}

export interface LineItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
