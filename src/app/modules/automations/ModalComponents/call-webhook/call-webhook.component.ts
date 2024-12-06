import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-call-webhook',
  templateUrl: './call-webhook.component.html',
  styleUrls: ['./call-webhook.component.css']
})
export class CallWebhookComponent {
  projectFormWebHook: FormGroup;
  constructor(private dialogRef: MatDialogRef<CallWebhookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AccountService,
    private fb: FormBuilder) {
    this.projectFormWebHook = this.fb.group({
      targetedUrl: ['', Validators.required],
    });

    if (data.isUpdate) {
      this.projectFormWebHook.patchValue({
        targetedUrl: data.actionObj.targetedUrl
      });
      console.log(this.projectFormWebHook.value)
    }
  }

  onSubmit(): void {
    this.projectFormWebHook.markAllAsTouched()
    if (this.projectFormWebHook.valid) {
      const formData = this.projectFormWebHook.value;
      this.dialogRef.close(formData);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}