import { Injectable } from '@angular/core';
import { InvoiceDto } from './InvoiceDto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private staticData: InvoiceDto[] = [
    {
      createdBy: 'John Doe',
      dateCreated: new Date(),
      dateInvoice: new Date(),
      status: '',
      SyncedToQB: false,
      notes: 'Nothing Here',
      DueDate: new Date(),
      InvoiceNumber: '12345',
      Total: 323,
      related: 'Contact 1', // Related to contact or jo
      lineItems: [
        { description: 'Item 1', quantity: 2, unitPrice: 200, totalPrice: 400 },
        { description: 'Item 2', quantity: 3, unitPrice: 200, totalPrice: 600 },
      ],
    },
  ];

  constructor() {}

  getAllInvoice(
    related: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const filteredInvoice = this.staticData.filter(
      (invoice) => invoice.related === related
    );

    // Pagination logic
    const paginatedInvoice = filteredInvoice.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );

    return of({
      payload: paginatedInvoice,
      totalCount: filteredInvoice.length,
      pageIndex,
    });
  }
  // 2. Delete an estimate by its number
  deleteInvoice(InvoiceNumber: string): Observable<InvoiceDto[]> {
    // Perform the delete action
    this.staticData = this.staticData.filter(
      (invoice) => invoice.InvoiceNumber !== InvoiceNumber
    );
    return of(this.staticData);
  }

  // 3. Update an estimate
  updateInvoice(updatedInvoice: InvoiceDto): Observable<InvoiceDto[]> {
    const index = this.staticData.findIndex(
      (invoice) => invoice.InvoiceNumber === updatedInvoice.InvoiceNumber
    );
    if (index > -1) {
      this.staticData[index] = updatedInvoice;
    }
    return of(this.staticData);
  }

  // 4. Add a new estimate
  addInvoice(newInvoice: InvoiceDto): Observable<InvoiceDto[]> {
    this.staticData.push(newInvoice);
    return of(this.staticData);
  }
}
