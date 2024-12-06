import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-related-contact-details',
  templateUrl: './related-contact-details.component.html',
  styleUrls: ['./related-contact-details.component.css']
})
export class RelatedContactDetailsComponent {
  public model: any = {};
  public modelMain: any = {};
  updateData: any = {};

  constructor(private dialogRef: MatDialogRef<RelatedContactDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);
    }
  }

  closeRelatedContactsModal() {
    this.dialogRef.close();
  }
}
