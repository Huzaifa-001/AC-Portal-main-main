import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-budget',
  templateUrl: './edit-budget.component.html',
  styleUrls: ['./edit-budget.component.css']
})
export class EditBudgetComponent {
  budgetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditBudgetComponent>
  ) {
    this.budgetForm = this.fb.group({
      budgetNumber: ['', Validators.required],
      createdBy: ['', Validators.required],
      grossProfit: [0, [Validators.required, Validators.min(0)]],
      netProfit: [0, [Validators.required, Validators.min(0)]],
      related: ['', Validators.required],
      description: [''], // Optional
    });
  }

  // Submit the form
  onSubmit(): void {
    if (this.budgetForm.valid) {
      this.dialogRef.close(this.budgetForm.value); // Pass form data back
    }
  }

  // Close the modal without submitting
  onCancel(): void {
    this.dialogRef.close(null);
  }
}


