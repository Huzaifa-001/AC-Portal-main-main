import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EstimateDto } from '../Dtos/estimateDto';

@Injectable({
  providedIn: 'root',
})
export class EstimatesService {
  private staticData: EstimateDto[] = [
    {
      createdBy: 'John Doe',
      customerNote: 'Customer wants to add more items',
      dateCreated: new Date(),
      dateEstimate: new Date(),
      dateStatusChange: new Date(),
      dateUploaded: new Date(),
      internalNote: 'Needs review',
      isArchived: false,
      location: 'Location A',
      markup: 15,
      number: 'E12345',
      related: 'Contact 1', // Related to contact or job
      salesRep: 'Rep A',
      salesRepImage: 'rep-a.jpg',
      signatureStatus: 'Signed',
      status: 'Approved',
      subTotal: 1000,
      syncedToQB: true,
      tax: 100,
      total: 1100,
      lineItems: [
        { description: 'Item 1', quantity: 2, unitPrice: 200, totalPrice: 400 },
        { description: 'Item 2', quantity: 3, unitPrice: 200, totalPrice: 600 },
      ],
    },
    // More sample estimates here...
  ];

  constructor() {}

  // 1. Get all estimates for a specific contact/job
  // 1. Get all estimates with pagination
  getAllEstimates(
    related: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const filteredEstimates = this.staticData.filter(
      (estimate) => estimate.related === related
    );

    // Pagination logic
    const paginatedEstimates = filteredEstimates.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );

    return of({
      payload: paginatedEstimates,
      totalCount: filteredEstimates.length,
      pageIndex,
    });
  }
  // 2. Delete an estimate by its number
  deleteEstimate(estimateNumber: string): Observable<EstimateDto[]> {
    // Perform the delete action
    this.staticData = this.staticData.filter(
      (estimate) => estimate.number !== estimateNumber
    );
    return of(this.staticData);
  }

  // 3. Update an estimate
  updateEstimate(updatedEstimate: EstimateDto): Observable<EstimateDto[]> {
    const index = this.staticData.findIndex(
      (estimate) => estimate.number === updatedEstimate.number
    );
    if (index > -1) {
      this.staticData[index] = updatedEstimate;
    }
    return of(this.staticData);
  }

  // 4. Add a new estimate
  addEstimate(newEstimate: EstimateDto): Observable<EstimateDto[]> {
    this.staticData.push(newEstimate);
    return of(this.staticData);
  }
}
