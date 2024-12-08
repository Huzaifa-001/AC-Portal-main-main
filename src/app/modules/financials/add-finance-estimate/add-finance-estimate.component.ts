import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-finance-estimate',
  templateUrl: './add-finance-estimate.component.html',
  styleUrls: ['./add-finance-estimate.component.css']
})
export class AddFinanceEstimateComponent {
  estimateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddFinanceEstimateComponent>
  ) {
    // Initialize form with all required fields
    this.estimateForm = this.fb.group({
      estimateNumber: ['', Validators.required],
      date: [new Date(), Validators.required],
      customerNote: [''],
      internalNote: [''],
      syncedToQB: [false],
      signed: [false],
      status: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      items: this.fb.array([]), // Array for line items
    });

    // Add one default line item
    this.addItem();
  }

  // Getter for line items
  get items(): FormArray {
    return this.estimateForm.get('items') as FormArray;
  }

  // Add a new line item
  addItem(): void {
    this.items.push(
      this.fb.group({
        name: ['', Validators.required],
        description: [''],
        unitCost: [0, [Validators.required, Validators.min(0)]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        markup: [0, [Validators.min(0)]],
        tax: [0, [Validators.min(0)]],
        total: [0],
      })
    );
  }

  // Remove a line item
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // Calculate total for each item
  calculateItemTotal(item: FormGroup): void {
    const unitCost = item.get('unitCost')?.value || 0;
    const quantity = item.get('quantity')?.value || 0;
    const markup = item.get('markup')?.value || 0;
    const tax = item.get('tax')?.value || 0;

    const total = (unitCost * quantity) + markup + tax;
    item.get('total')?.setValue(total, { emitEvent: false });
  }

  // Submit the form
  submitForm(): void {
    if (this.estimateForm.valid) {
      this.dialogRef.close(this.estimateForm.value); // Pass data back to parent
    }
  }

  // Close the modal
  closeDialog(): void {
    this.dialogRef.close();
  }
}
