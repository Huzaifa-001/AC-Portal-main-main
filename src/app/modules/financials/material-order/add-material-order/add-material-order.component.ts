import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-material-order',
  templateUrl: './add-material-order.component.html',
  styleUrls: ['./add-material-order.component.css'],
})
export class AddMaterialOrderComponent {
  materialOrderForm: FormGroup;
submitMaterialOrder: any;
cancelMaterialOrder: any;
closeModal: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddMaterialOrderComponent>
  ) {
    this.materialOrderForm = this.fb.group({
      materialOrderNumber: ['', Validators.required],
      createdBy: ['', Validators.required],
      dateBudget: ['', Validators.required],
      notes: [''],
      status: ['', Validators.required],
      related: ['', Validators.required],
      lineItems: this.fb.array([]),
    });
  }

  get lineItems(): FormArray {
    return this.materialOrderForm.get('lineItems') as FormArray;
  }

  addLineItem(): void {
    const lineItemGroup = this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [{ value: 0, disabled: true }],
    });

    // Calculate total price dynamically
    lineItemGroup.get('quantity')?.valueChanges.subscribe(() =>
      this.updateTotalPrice(lineItemGroup)
    );
    lineItemGroup.get('unitPrice')?.valueChanges.subscribe(() =>
      this.updateTotalPrice(lineItemGroup)
    );

    this.lineItems.push(lineItemGroup);
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
  }

  updateTotalPrice(lineItemGroup: FormGroup): void {
    const quantity = lineItemGroup.get('quantity')?.value || 0;
    const unitPrice = lineItemGroup.get('unitPrice')?.value || 0;
    const totalPrice = quantity * unitPrice;
    lineItemGroup.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
  }

  submit(): void {
    if (this.materialOrderForm.valid) {
      this.dialogRef.close(this.materialOrderForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
