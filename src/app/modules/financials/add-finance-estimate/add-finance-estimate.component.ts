import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-finance-estimate',
  templateUrl: './add-finance-estimate.component.html',
  styleUrls: ['./add-finance-estimate.component.css']
})
export class AddFinanceEstimateComponent {
  estimateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.estimateForm = this.fb.group({
      estimateNumber: ['', Validators.required],
      date: ['', Validators.required],
      customerInfo: ['', Validators.required],
      items: this.fb.array([]), // Dynamically add items
      subtotal: [0, Validators.required],
      tax: [0, Validators.required],
      total: [0, Validators.required],
    });

    this.calculateTotal();
  }

  // Accessor for the items FormArray
  get items(): FormArray {
    return this.estimateForm.get('items') as FormArray;
  }

  // Add a new item row
  addItem(): void {
    const item = this.fb.group({
      itemName: ['', Validators.required],
      description: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      amount: [{ value: 0, disabled: true }]
    });

    item.get('quantity')?.valueChanges.subscribe(() => this.updateItemAmount(item));
    item.get('price')?.valueChanges.subscribe(() => this.updateItemAmount(item));

    this.items.push(item);
  }

  // Update the total amount for an item row
  updateItemAmount(item: FormGroup): void {
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    item.get('amount')?.setValue(quantity * price, { emitEvent: false });
    this.calculateTotal();
  }

  // Remove an item row
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotal();
  }

  // Calculate subtotal, tax, and total
  calculateTotal(): void {
    const subtotal = this.items.controls.reduce((sum, item) => {
      return sum + (item.get('amount')?.value || 0);
    }, 0);

    const tax = subtotal * 0.1; // Example: 10% tax
    const total = subtotal + tax;

    this.estimateForm.patchValue({ subtotal, tax, total });
  }

  // Submit form
  submitForm(): void {
    if (this.estimateForm.valid) {
      console.log('Estimate Data:', this.estimateForm.value);
    }
  }
}
