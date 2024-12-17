import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstimateDto } from '../EstimateDto';

@Component({
  selector: 'app-estimate-detail',
  templateUrl: './estimate-detail.component.html',
  styleUrls: ['./estimate-detail.component.css'],
})
export class EstimateDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<EstimateDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public estimate: EstimateDto
  ) {}

  // Close the modal
  close(): void {
    this.dialogRef.close();
  }
}
