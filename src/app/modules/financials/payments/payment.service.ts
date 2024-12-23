import { Injectable } from '@angular/core';
import { PaymentDto } from './PaymentDto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private staticData: PaymentDto[] = [
    {
      paymentId: 1,
      createdBy: 'John Doe',
      dateCreated: new Date(),
      dateUpdated: new Date(),
      paymentDate: new Date(),
      paymentMethod: 'Credit Card',
      totalAmount: 123412,
      status: 'Pending',
      refrenceNumber: 'Astd-32423',
      notes: 'Nothing Here',
      related: 'Contact 1', // Related to contact or jo
      lineItems: [
        { description: 'Item 1', quantity: 2, unitPrice: 200, totalPrice: 400 },
        { description: 'Item 2', quantity: 3, unitPrice: 200, totalPrice: 600 },
      ],
    },
  ];

  constructor() {}

  getAllPayments(
    related: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const filteredPayments = this.staticData.filter(
      (payment) => payment.related === related
    );

    // Pagination logic
    const paginatedPayments = filteredPayments.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );

    return of({
      payload: paginatedPayments,
      totalCount: filteredPayments.length,
      pageIndex,
    });
  }
  // 2. Delete an estimate by its number
  deletePayment(paymentId: number): Observable<PaymentDto[]> {
    // Perform the delete action
    this.staticData = this.staticData.filter(
      (payment) => payment.paymentId !== paymentId
    );
    return of(this.staticData);
  }

  // 3. Update an estimate
  updatePayment(updatedPayment: PaymentDto): Observable<PaymentDto[]> {
    const index = this.staticData.findIndex(
      (payment) => payment.paymentId === updatedPayment.paymentId
    );
    if (index > -1) {
      this.staticData[index] = updatedPayment;
    }
    return of(this.staticData);
  }

  // 4. Add a new estimate
  addPayment(newPayment: PaymentDto): Observable<PaymentDto[]> {
    this.staticData.push(newPayment);
    return of(this.staticData);
  }
}
