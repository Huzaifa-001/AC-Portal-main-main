import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/core/services/account.service';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';

@Component({
  selector: 'app-add-sms-template',
  templateUrl: './add-sms-template.component.html',
  styleUrls: ['./add-sms-template.component.css']
})
export class AddSmsTemplateComponent {
  smsTemplateForm: FormGroup;
  constructor(private dialogRef: MatDialogRef<AddSmsTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateService: AutomationAndTemplateService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.smsTemplateForm = this.fb.group({
      id:[0],
      name: ['', Validators.required],
      message: ['', Validators.required]
    });

    if (data.isUpdate) {
      this.smsTemplateForm.patchValue({
        id:data.id,
        name: data.name,
        message: data.message
      });
    }
  }

  onSubmit(): void {
    this.smsTemplateForm.markAllAsTouched();
    if (this.smsTemplateForm.valid) {
      const formData = this.smsTemplateForm.value;
      if (formData.id > 0) {
        this.templateService.updateSMSTemplate(formData).subscribe(
          response => {
            this.toastr.success(response.message);
            this.dialogRef.close(true);
          },
          error => {
            this.toastr.error(error.message);

          }
        );
      } else {
        this.templateService.createSMSTemplate(formData).subscribe(
          response => {
            this.toastr.success(response.message);
            this.dialogRef.close(true);
          },
          error => {
            this.toastr.error(error.message);
          }
        );
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
