import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-auto-action',
  templateUrl: './auto-action.component.html',
  styleUrls: ['./auto-action.component.css']
})
export class AutoActionComponent {
  updateData: any;
  actionId: string;
  projectForm: FormGroup;
  projectFormChangeField: FormGroup;
  projectFormSendTextMessage: FormGroup;
  projectFormSendEmail: FormGroup;
  projectFormCallWebhook: FormGroup;
  projectFormCreateTask: FormGroup;
  projectFormPromptCreateObject: FormGroup;
  projectFormPromptCreateBudget: FormGroup;
  projectFormMaterialOrder: FormGroup;
  projectFormWorkOrder: FormGroup;
  projectFormNoteUnderObject: FormGroup;

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.projectForm = this.formBuilder.group({});
    this.projectFormChangeField = this.formBuilder.group({});
    this.projectFormSendTextMessage = this.formBuilder.group({});
    this.projectFormSendEmail = this.formBuilder.group({});
    this.projectFormCallWebhook = this.formBuilder.group({});
    this.projectFormCreateTask = this.formBuilder.group({});
    this.projectFormPromptCreateObject = this.formBuilder.group({});
    this.projectFormPromptCreateBudget = this.formBuilder.group({});
    this.projectFormMaterialOrder = this.formBuilder.group({});
    this.projectFormWorkOrder = this.formBuilder.group({});
    this.projectFormNoteUnderObject = this.formBuilder.group({});

    if (data) {
      this.updateData = data;
    }
  }

  onSubmit() {
    // Implement onSubmit method
  }

  closeDailog() {
    // Implement closeDailog method
  }
}
