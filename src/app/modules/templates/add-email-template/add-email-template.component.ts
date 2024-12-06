import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';

@Component({
  selector: 'app-add-email-template',
  templateUrl: './add-email-template.component.html',
  styleUrls: ['./add-email-template.component.css']
})
export class AddEmailTemplateComponent {
  emailTemplateForm: FormGroup;
  constructor(private dialogRef: MatDialogRef<AddEmailTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateService: AutomationAndTemplateService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.emailTemplateForm = this.fb.group({
      id:[0],
      name: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });

    if (data.isUpdate) {
      this.emailTemplateForm.patchValue({
        id:data.id,
        name: data.name,
        subject: data.subject,
        body: data.body
      });
    }
  }

  onSubmit(): void {
    this.emailTemplateForm.markAllAsTouched();
    if (this.emailTemplateForm.valid) {
      const formData = this.emailTemplateForm.value;
      if (formData.id > 0) {
        this.templateService.updateEmailTemplate(formData).subscribe(
          response => {
            this.toastr.success(response.message);
            this.dialogRef.close(true);
          },
          error => {
            this.toastr.error(error.message);
          }
        );
      } else {
        this.templateService.createEmailTemplate(formData).subscribe(
          response => {
            this.toastr.success(response.message);
            this.dialogRef.close(true);
          },
          error => {
            console.error('Error creating email template', error);
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
