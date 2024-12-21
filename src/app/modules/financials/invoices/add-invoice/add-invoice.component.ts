import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css'],
})
export class AddInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  dialogRef: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      date: ['', Validators.required],
      customerNote: [''],
      internalNote: [''],
      subtotal: [0, [Validators.required, Validators.min(0)]],
      tax: [0, [Validators.required, Validators.min(0)]],
      total: [0, [Validators.required, Validators.min(0)]],
      lineItems: this.fb.array([]),
    });

    this.addLineItem(); // Add the first line item when the form is initialized
  }

  get lineItems(): FormArray {
    return this.invoiceForm.get('lineItems') as FormArray;
  }

  addLineItem(): void {
    this.lineItems.push(
      this.fb.group({
        itemName: ['', Validators.required],
        description: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitCost: [0, [Validators.required, Validators.min(0)]],
        markup: [0, [Validators.required, Validators.min(0)]],
        amount: [0, Validators.required],
        tax: [0, Validators.required],
      })
    );
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
  }

  updateItemAmount(index: number): void {
    const item = this.lineItems.at(index);
    const quantity = item.get('quantity')?.value;
    const unitCost = item.get('unitCost')?.value;
    const markup = item.get('markup')?.value;

    const amount = (unitCost * quantity) + ((unitCost * quantity) * (markup / 100));
    const tax = amount * 0.1; // Example: 10% tax

    item.get('amount')?.setValue(amount);
    item.get('tax')?.setValue(tax);
    
    this.updateInvoiceTotals();
  }

  updateInvoiceTotals(): void {
    let subtotal = 0;
    let totalTax = 0;
    
    this.lineItems.controls.forEach(item => {
      subtotal += item.get('amount')?.value || 0;
      totalTax += item.get('tax')?.value || 0;
    });

    const total = subtotal + totalTax;
    this.invoiceForm.get('subtotal')?.setValue(subtotal);
    this.invoiceForm.get('tax')?.setValue(totalTax);
    this.invoiceForm.get('total')?.setValue(total);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  submitInvoice(): void {
    if (this.invoiceForm.valid) {
      console.log(this.invoiceForm.value);
      // Emit or call a service to save the invoice
    }
  }
}
function submitInvoice() {
  throw new Error('Function not implemented.');
}

