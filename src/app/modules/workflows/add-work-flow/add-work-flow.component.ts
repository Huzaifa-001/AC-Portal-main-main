import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Status, Workflow } from 'src/app/core/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WorkflowService } from 'src/app/core/workflow.service';


@Component({
  selector: 'app-add-work-flow',
  templateUrl: './add-work-flow.component.html',
  styleUrls: ['./add-work-flow.component.css']
})
export class AddWorkFlowsComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA];
  statuses: Status[] = [];
  workFlowForm: FormGroup;
  updateData: Workflow
  modelMain: any;
  isVisible = true
  private subscriptions: Subscription = new Subscription();
  relatedContacts: any;
  ngOnInit(): void {
    // Now you can safely access statuses within this method
  }
  constructor(
    private dialogRef: MatDialogRef<AddWorkFlowsComponent>,
    private fb: FormBuilder,
    private jobService: JobService,
    private workFlowService: WorkflowService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Workflow,

  ) {
    //this.getRelatedcontacts()
    this.workFlowForm = new FormGroup({
      workFlowName: new FormControl('', [Validators.required]),
      isVisible: new FormControl(true, [Validators.required]),
      isAccessable: new FormControl(false)
    });

    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);
      this.workFlowForm.patchValue(this.updateData);
      this.statuses = this.updateData.statuses?? []
    } 
    else {
      this.statuses = []
    }

  }

  onSubmit(): void { 
    debugger
    this.workFlowForm.markAllAsTouched();
    if (this.workFlowForm.valid) {
      const newworkFlow = this.workFlowForm.value;
      this.statuses.forEach(x=> x.workFlowId = this.updateData.id?? 0)
      var payload: Workflow = {
        id: this.updateData.id ?? 0,
        isAccessable: newworkFlow.isAccessable,
        isVisible: newworkFlow.isVisible,
        workFlowName: newworkFlow.workFlowName,
        statuses: this.statuses,
        workFlowType: this.updateData.workFlowType
      }
      this.workFlowService.createWorkflow(payload).subscribe(
        (res) => {
          var txt = this.updateData.id > 0 ? 'updated' : 'inserted'
          this.snackBar.open(`Record ${txt} successfully`, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          //this.router.navigate(['/settings/workflows/']);
          this.dialogRef.close();
        },
        (err) => {
          console.log(err);
          this.snackBar.open('Error', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        },
        () => {
          // Handle the complete event
          this.dialogRef.close(newworkFlow);
        }
      );
      
    }

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getRelatedcontacts() {
    this.subscriptions.add(
      this.jobService.allRelatedContacts().subscribe({
        next: (res) => {
          this.relatedContacts = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }



// chip


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.statuses.push({ id: 0, statusName: value, workFlowId: 0 });
    }
    event.chipInput!.clear();
  }

  remove(status: Status): void {
    const index = this.statuses.indexOf(status);

    if (index >= 0) {
      this.statuses.splice(index, 1);
    }
  }

  edit(status: Status, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(status);
      return;
    }
    const index = this.statuses.indexOf(status);
    if (index >= 0) {
      this.statuses[index].statusName = value;
    }
  }

}
