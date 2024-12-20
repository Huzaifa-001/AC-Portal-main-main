import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css'],
})
export class AddInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      InvoiceNumber: ['', Validators.required],
      createdBy: ['', Validators.required],
      dateInvoice: ['', Validators.required],
      dateCreated: [new Date(), Validators.required],
      SyncedToQB: [false],
      DueDate: ['', Validators.required],
      notes: [''],
      Total: [0, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      related: ['', Validators.required],
      lineItems: this.fb.array([]),
    });
  }

  get lineItems(): FormArray {
    return this.invoiceForm.get('lineItems') as FormArray;
  }

  addLineItem(): void {
    this.lineItems.push(
      this.fb.group({
        description: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [0, [Validators.required, Validators.min(0)]],
        totalPrice: [0, Validators.required],
      })
    );
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
  }

  submitInvoice(): void {
    if (this.invoiceForm.valid) {
      console.log(this.invoiceForm.value);
      // Emit or call a service to save the invoice.
    }
  }
}
