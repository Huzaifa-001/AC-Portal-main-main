import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EstimateDto } from '../EstimateDto';
import { ToastrService } from 'ngx-toastr';
import { EstimatesService } from '../estimate.service';

@Component({
  selector: 'app-edit-estimate',
  templateUrl: './edit-estimate.component.html',
  styleUrls: ['./edit-estimate.component.css'],
})
export class EditEstimateComponent implements OnInit {
  estimateForm: FormGroup;
  updateData: EstimateDto | null = null;
  @Output() estimateUpdated = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private estimatesService: EstimatesService, // Inject service
    public dialogRef: MatDialogRef<EditEstimateComponent>, // Updated to correct dialog reference
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.estimateForm = this.fb.group({
      estimateNumber: [{ value: '#00001', disabled: true }],
      date: [new Date(), Validators.required], // Set current date as default value
      notes: [''],
      status: ['Draft'],
      syncedToQB: [false],
      signed: [false],
      items: this.fb.array([]),
      subtotal: [{ value: 0, disabled: true }],
      tax: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
    });

    // Fetch estimate data based on the passed 'number' parameter
    this.estimatesService
      .getAllEstimates(this.data.related, 1, 10)
      .subscribe((response) => {
        const estimate = response.payload.find(
          (e: EstimateDto) => e.number === this.data.estimateNumber
        );
        if (estimate) {
          this.updateData = estimate;
          this.populateForm(this.updateData);
        }
      });
  }

  get items(): FormArray {
    return this.estimateForm.get('items') as FormArray;
  }

  populateForm(data: EstimateDto): void {
    this.estimateForm.patchValue({
      estimateNumber: data.number,
      date: data.dateEstimate,
      notes: data.customerNote,
      status: data.status,
      syncedToQB: data.syncedToQB,
      signed: data.signatureStatus === 'Signed',
      subtotal: data.subTotal,
      tax: data.tax,
      total: data.total,
    });

    this.items.clear(); // Ensure the array is cleared before adding new items
    data.lineItems.forEach((item) => {
      this.items.push(
        this.fb.group({
          itemName: [item.itemName, Validators.required],
          description: [item.description, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.unitPrice, [Validators.required, Validators.min(0)]],
          amount: [{ value: item.totalPrice, disabled: true }],
        })
      );
    });

    this.updateTotals(); // Recalculate totals after populating the form
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        itemName: ['', Validators.required],
        description: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(0)]],
        amount: [{ value: 0, disabled: true }],
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateTotals(); // Recalculate totals after removing an item
  }

  updateItemAmount(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity').value;
    const price = item.get('price').value;
    const amount = quantity * price;

    item.get('amount').setValue(amount);
    this.updateTotals(); // Recalculate totals after updating item amount
  }

  updateTotals(): void {
    let subtotal = 0;
    this.items.controls.forEach((item: any) => {
      subtotal += item.get('amount').value;
    });

    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + tax;

    this.estimateForm.patchValue({
      subtotal: subtotal,
      tax: tax,
      total: total,
    });
  }

  submitForm(): void {
    if (this.estimateForm.valid && this.updateData) {
      // Create an updated estimate DTO to pass to the service
      const updatedEstimate: EstimateDto = {
        ...this.updateData,
        ...this.estimateForm.value, // Merge form data into the existing data
        lineItems: this.items.value,
      };

      this.estimatesService
        .updateEstimate(updatedEstimate)
        .subscribe((updatedEstimates) => {
          this.estimateUpdated.emit(updatedEstimate);
          this.dialogRef.close();
        });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
