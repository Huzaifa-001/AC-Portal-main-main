import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-or-update-event',
  templateUrl: './add-or-update-event.component.html',
  styleUrls: ['./add-or-update-event.component.css']
})
export class AddOrUpdateEventComponent {
  endTime
  startTime
  description
  eventName
  constructor(private dialogRef: MatDialogRef<AddOrUpdateEventComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  onDelete() {
    this.dialogRef.close('delete');
  }

  onUpdate() {
    this.dialogRef.close('update');
  }
}
