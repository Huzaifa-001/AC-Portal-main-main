import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent {
  updateData: any;
  constructor(
    private dialogRef: MatDialogRef<SubscriptionPlansComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.updateData = data
  }
  onCancelClick(): void {
  this.dialogRef.close();
}
}
