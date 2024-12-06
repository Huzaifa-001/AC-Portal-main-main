import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from '../core/services/job.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {

  public modelMain: any = {};
  phoneNumbers: { id: string, phoneNumber: string, typeId: string, typeName: string }[] = [];
  updateData: any = {};

  constructor(private dialogRef: MatDialogRef<ConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private jobService: JobService) {
      if (data) {
        this.modelMain = data;
        this.updateData = Object.assign({}, this.modelMain);
        this.updateData.message = this.modelMain.message ?? "You want to delete this item?";
      }
  }
  
  

  closeConfirmModal() {
    this.dialogRef.close(false);
  }

  confirmDelete() : void {
    this.dialogRef.close(true);
  }
}

