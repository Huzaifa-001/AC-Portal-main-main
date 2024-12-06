import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/account.service';
import { SendEmailComponent } from '../send-email/send-email.component';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';

@Component({
  selector: 'app-send-text-message',
  templateUrl: './send-text-message.component.html',
  styleUrls: ['./send-text-message.component.css']
})
export class SendTextMessageComponent {
  projectFormSendSMS: FormGroup;
  selectOptions = [
    { label: 'Current Assignees', value: 'assignees' },
    { label: 'Contact', value: 'contact' },
    { label: 'Sales Rep', value: 'salesRep' },
    { label: 'All Related Contact(s)', value: 'relatedContacts' },
  ];
  smsTemplates = [];
  constructor(private dialogRef: MatDialogRef<SendTextMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AccountService,
    private templateService: AutomationAndTemplateService,
    private fb: FormBuilder) {
      this.getAllEmailTemplates()
    this.projectFormSendSMS = this.fb.group({
      template: [0, Validators.required],
      recipients: [[], Validators.required]
    });

    this.authService.getUserProfile().subscribe(user => {
      this.selectOptions.push({
        label: user.payload.firstName + ' ' + user.payload.lastName,
        value: user.payload.id
      })
      if (data.isUpdate) {
        this.projectFormSendSMS.patchValue({
          template: data.template.id ?? data.id,
          recipients: data.recipients
        });
        console.log(this.projectFormSendSMS.value)
      }
    })
  }

  getAllEmailTemplates(): void {
    this.templateService.getAllSMSTemplates().subscribe(
      templates => {
        this.smsTemplates = templates.data;
      },
      error => {
        console.error('Error fetching SMS templates:', error);
      }
    );
  }


  onSubmit(): void {
    this.projectFormSendSMS.markAllAsTouched()
    if (this.projectFormSendSMS.valid) {
      const formData = this.projectFormSendSMS.value;
      formData.template = this.smsTemplates.find(x => x.id == formData.template)
      this.dialogRef.close(formData);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}