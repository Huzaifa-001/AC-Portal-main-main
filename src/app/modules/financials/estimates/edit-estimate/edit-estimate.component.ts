import { Component, Inject } from '@angular/core';
import { EstimateDto } from '../../Dtos/estimateDto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-estimate',
  templateUrl: './edit-estimate.component.html',
  styleUrls: ['./edit-estimate.component.css'],
})
export class EditEstimateComponent {
  estimate: EstimateDto;

  constructor(
    public dialogRef: MatDialogRef<EditEstimateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EstimateDto
  ) {
    this.estimate = { ...data }; // Make a copy of the data
  }

  // Close the dialog and pass the updated estimate back to the caller
  onSave(): void {
    this.dialogRef.close(this.estimate);
  }

  // Close the dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }
}
