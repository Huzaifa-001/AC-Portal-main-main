import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-estimate',
  templateUrl: './add-estimate.component.html',
  styleUrls: ['./add-estimate.component.css'],
})
export class AddEstimateComponent {
  estimateForm: FormGroup;
  updateData: any;
  @Output() estimateUpdated = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddEstimateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateData = data;
  }

  ngOnInit() {
    this.estimateForm = this.fb.group({
      estimateNumber: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
      status: ['Draft'],
      syncedToQB: [false],
      signed: [false],
      items: this.fb.array([]),
      subtotal: [0],
      tax: [0],
      total: [0],
    });

    if (this.updateData) {
      this.populateForm(this.updateData);
    }
  }

  get items(): FormArray {
    return this.estimateForm.get('items') as FormArray;
  }

  populateForm(data: any): void {
    this.estimateForm.patchValue(data);
    this.items.clear();
    data.items.forEach((item: any) =>
      this.items.push(
        this.fb.group({
          itemName: [item.itemName, Validators.required],
          description: [item.description, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.price, [Validators.required, Validators.min(0)]],
          amount: [{ value: item.amount, disabled: true }],
        })
      )
    );
    this.updateTotals(); // Calculate totals when editing
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
    if (this.estimateForm.valid) {
      this.estimateUpdated.emit(this.estimateForm.value);
      this.dialogRef.close();
    } else {
      this.toastr.error('Please fill in all required fields.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
