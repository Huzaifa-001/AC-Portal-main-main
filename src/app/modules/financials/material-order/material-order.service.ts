import { Injectable } from '@angular/core';
import { MaterialOrderDto } from './MarterialOrderDto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaterialOrderService {
  private staticData: MaterialOrderDto[] = [
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

  getAllMaterialOrders(
    related: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const filteredMaterialOrders = this.staticData.filter(
      (materialOrder) => materialOrder.related === related
    );

    // Pagination logic
    const paginatedMaterialOrders = filteredMaterialOrders.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );

    return of({
      payload: paginatedMaterialOrders,
      totalCount: filteredMaterialOrders.length,
      pageIndex,
    });
  }
  // 2. Delete an estimate by its number
  deleteMaterialOrder(
    materialOrderNumber: string
  ): Observable<MaterialOrderDto[]> {
    // Perform the delete action
    this.staticData = this.staticData.filter(
      (materialOrder) =>
        materialOrder.materialOrderNumber !== materialOrderNumber
    );
    return of(this.staticData);
  }

  // 3. Update an estimate
  updateMaterialOrder(
    updatedMaterialOrder: MaterialOrderDto
  ): Observable<MaterialOrderDto[]> {
    const index = this.staticData.findIndex(
      (materialOrder) =>
        materialOrder.materialOrderNumber ===
        updatedMaterialOrder.materialOrderNumber
    );
    if (index > -1) {
      this.staticData[index] = updatedMaterialOrder;
    }
    return of(this.staticData);
  }

  // 4. Add a new estimate
  addMaterialOrder(
    newMaterialOrder: MaterialOrderDto
  ): Observable<MaterialOrderDto[]> {
    this.staticData.push(newMaterialOrder);
    return of(this.staticData);
  }
}
