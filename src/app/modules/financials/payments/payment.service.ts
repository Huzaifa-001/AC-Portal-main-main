import { Injectable } from '@angular/core';
import { PaymentDto } from './PaymentDto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private staticData: PaymentDto[] = [
    {
      createdBy: 'John Doe',
      dateCreated: new Date(),
      dateBudget: new Date(),
      status: '',
      notes: 'Nothing Here',
      materialOrderNumber: 'MT-12345',
      related: 'Contact 1', // Related to contact or jo
      lineItems: [
        { description: 'Item 1', quantity: 2, unitPrice: 200, totalPrice: 400 },
        { description: 'Item 2', quantity: 3, unitPrice: 200, totalPrice: 600 },
      ],
    },
  ];

  constructor() {}

  getAllBudgets(
    related: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const filteredBudgets = this.staticData.filter(
      (budget) => budget.related === related
    );

    // Pagination logic
    const paginatedBudgets = filteredBudgets.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );

    return of({
      payload: paginatedBudgets,
      totalCount: filteredBudgets.length,
      pageIndex,
    });
  }
  // 2. Delete an estimate by its number
  deleteBudget(budgetNumber: string): Observable<PaymentDto[]> {
    // Perform the delete action
    this.staticData = this.staticData.filter(
      (budget) => budget.materialOrderNumber !== budgetNumber
    );
    return of(this.staticData);
  }

  // 3. Update an estimate
  updateBudget(updatedBudget: PaymentDto): Observable<PaymentDto[]> {
    const index = this.staticData.findIndex(
      (budget) =>
        budget.materialOrderNumber === updatedBudget.materialOrderNumber
    );
    if (index > -1) {
      this.staticData[index] = updatedBudget;
    }
    return of(this.staticData);
  }

  // 4. Add a new estimate
  addBudget(newBudget: PaymentDto): Observable<PaymentDto[]> {
    this.staticData.push(newBudget);
    return of(this.staticData);
  }
}
