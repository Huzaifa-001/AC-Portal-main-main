import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/core/services/account.service';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';
import { JobService } from 'src/app/core/services/job.service';
import { createWorkflowDto } from 'src/app/modules/job/createWorkflowDto';
import { selectOptions } from '../../common';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent {
  projectFormSendEmail: FormGroup;
  selectOptions = [];

  emailTemplates = [];

  constructor(private dialogRef: MatDialogRef<SendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AccountService,
    private templateService: AutomationAndTemplateService,
    private fb: FormBuilder) {
    this.selectOptions = selectOptions
    this.getAllEmailTemplates()
    this.projectFormSendEmail = this.fb.group({
      template: [0, Validators.required],
      recipients: [[], Validators.required]
    });

    authService.getUserProfile().subscribe(user => {
      this.selectOptions.push({
        label: user.payload.firstName + ' ' + user.payload.lastName,
        value: user.payload.userName
      })
      if (data.isUpdate) {
        this.projectFormSendEmail.patchValue({
          template: data.actionObj?.template?.id ?? 0,
          recipients: data.actionObj?.recipients ?? []
        });
        console.log(this.projectFormSendEmail.value)
      }
    })
  }

  getAllEmailTemplates(): void {
    this.templateService.getAllEmailTemplates().subscribe(
      templates => {
        this.emailTemplates = templates.data;
      },
      error => {
        console.error('Error fetching email templates:', error);
      }
    );
  }

  onSubmit(): void {
    debugger
    this.projectFormSendEmail.markAllAsTouched()
    if (this.projectFormSendEmail.valid) {
      const formData = this.projectFormSendEmail.value;
      formData.template = this.emailTemplates.find(x => x.id == formData.template)
      this.dialogRef.close(formData);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}

