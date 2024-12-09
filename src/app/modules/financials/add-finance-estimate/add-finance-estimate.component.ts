import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-finance-estimate',
  standalone: true,
  templateUrl: './add-finance-estimate.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./add-finance-estimate.component.css']
})
export class AddFinanceEstimateComponent {
  estimateForm: FormGroup;
  companyLogo: string = 'assets/logo.png'; // Update with actual path if needed
  updateData = {
    FormTitle: 'Create New Estimate'
  };
  estimateDetails = {
    date: new Date().toLocaleDateString(),
    invoiceNumber: '12345',
    supplierName: 'Sample Supplier',
    supplierAddress: '123 Supplier Street',
    customerName: 'Sample Customer',
    customerAddress: '456 Customer Avenue',
    paymentDetails: 'Paid via credit card on delivery.',
    notes: 'This is a sample estimate note.'
  };

  constructor(private fb: FormBuilder) {
    this.estimateForm = this.fb.group({
      estimateNumber: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
      syncedToQB: [false],
      signed: [false],
      items: this.fb.array([]),
      subtotal: [{ value: 0, disabled: true }, Validators.required],
      tax: [{ value: 0, disabled: true }, Validators.required],
      total: [{ value: 0, disabled: true }, Validators.required],
      status: ['Draft', Validators.required]
    });

    this.addItem(); // Initial item
  }

  get items(): FormArray {
    return this.estimateForm.get('items') as FormArray;
  }

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
    this.calculateTotal();
  }

  updateItemAmount(item: FormGroup): void {
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    item.get('amount')?.setValue(quantity * price, { emitEvent: false });
    this.calculateTotal();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotal();
  }

  clearAllItems(): void {
    while (this.items.length > 0) {
      this.items.removeAt(0);
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    const subtotal = this.items.controls.reduce((sum, item) => {
      return sum + (item.get('amount')?.value || 0);
    }, 0);

    const tax = subtotal * 0.1; // Example: 10% tax
    const total = subtotal + tax;

    this.estimateForm.patchValue({ subtotal, tax, total });
  }

  getItemAmount(item: FormGroup): number {
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    return quantity * price;
  }

  closeDialog(): void {
    this.estimateForm.reset();
    this.items.clear();
    this.addItem(); // Re-add an initial item if needed
    console.log("Form reset and dialog closed");
  }

  submitForm(): void {
    if (this.estimateForm.valid) {
      console.log("Form submitted", this.estimateForm.value);
      // Add logic for form submission (e.g., send data to the server)
    } else {
      console.log("Form is invalid. Please check your entries.");
      // Optionally display user feedback for validation errors
    }
  }
}
