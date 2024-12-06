import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WorkFlowType } from 'src/app/core/interfaces';
import { ContactService } from 'src/app/core/services/contact.service';
import { JobService } from 'src/app/core/services/job.service';
import { WorkflowService } from 'src/app/core/workflow.service';
import { createWorkOrderDto } from 'src/app/modules/job/createWorkOrderDto';
import { NotesModalComponent } from 'src/app/modules/job/notes-modal/notes-modal.component';
import { selectOptions, timeUnitOptions } from '../../common';
import { AccountService } from 'src/app/core/services/account.service';

enum Priorities {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

@Component({
  selector: 'app-create-work-order',
  templateUrl: './create-work-order.component.html',
  styleUrls: ['./create-work-order.component.css']
})
export class CreateWorkOrderComponent {
  private subscriptions: Subscription = new Subscription();
  selectOptions = selectOptions
  timeUnitOptions = timeUnitOptions
  lineItemForm: FormGroup;
  lineItems: any[] = [];
  public model: any = {};
  public modelMain: any = {};
  updateData: any = {};
  Jobs: any[] = [];
  statuses = []
  workOrderForm!: FormGroup;
  workOrderDto?: createWorkOrderDto;
  priorities = Priorities;
  prioritykeys: string[] = [];
  notes: any[] = [];
  workflows: any[] = [];
  subcontractors: any[] = [];
  RelatedContactId: any[] = [];
  PrimaryContacts: any[] = [];
  TeamMememberId: any[] = [];
  selectedWorkflow: any;

  constructor(
    private dialogRef: MatDialogRef<CreateWorkOrderComponent>,
    private jobService: JobService,
    private authService: AccountService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private workFlowService: WorkflowService,
    private contactService: ContactService

  ) {
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain.actionObj);
    }
    this.prioritykeys = Object.keys(this.priorities);
  }

  ngOnInit(): void {
    this.workOrderForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),
      workflowId: new FormControl(0),
      workOrderStatus: new FormControl(0),
      teamMemberId: new FormControl([]),
      subContractorId: new FormControl([]),
      workOrderPriority: new FormControl(''),
      jobId: new FormControl(this.modelMain.jobId),
      startDate: new FormControl(''),
      dueDate: new FormControl(''),
      timeUnit: new FormControl(''),
      duration: new FormControl(''),
      lastStatusChangeDate: new FormControl(''),
      contactId: new FormControl(0),
    });

    this.lineItemForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      quantity: new FormControl(0, [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
    });

    this.authService.getUserProfile().subscribe(user => {
      this.selectOptions.push({
        label: user.payload.firstName + ' ' + user.payload.lastName,
        value: user.payload.id
      })
    });

    this.getWorkflows(),
      this.getAllcontacts(),
      this.getSubcontractors(),
      this.getRelatedcontacts(),
      this.getTeamMembers()
    this.getAllJobs()
    if (this.updateData) {
      const existingWorkOrder = this.updateData
      this.lineItems = existingWorkOrder.lineItems ?? []
      this.notes = existingWorkOrder.notes ?? []
      this.workOrderForm.patchValue(existingWorkOrder);
      this.getStatuses(this.updateData.workflowId);
    }
  }

  initAttachment() {
    return new FormGroup({
      id: new FormControl(0),
      filePath: new FormControl(''),
    });
  }

  initNote() {
    return new FormGroup({
      id: new FormControl(0),
      type: new FormControl(''),
      content: new FormControl(''),
      jobId: new FormControl(0),
      workOrderId: new FormControl(0),
      attachments: new FormControl([this.initAttachment()]),
      isDeleted: new FormControl(true),
    });
  }

  getStatuses(workflowId: any) {
    this.subscriptions.add(
      this.jobService.statusByWorkflowId(workflowId).subscribe(
        (res: any) => {
          this.statuses = res.payload
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  getWorkflows() {
    this.workFlowService.getWorkFlowByType(WorkFlowType.workOrder).subscribe({
      next: (res) => {
        this.workflows = res.payload;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  getSubcontractors() {
    this.subscriptions.add(
      this.jobService.allSubcontractors().subscribe({
        next: (res) => {
          this.subcontractors = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  onWorkflowSelectionChange(event: any): void {
    const selectedId = event.value;
    this.selectedWorkflow = this.workflows.find(wf => wf.id === selectedId);
    this.getStatuses(selectedId)
  }

  getRelatedcontacts() {
    this.subscriptions.add(
      this.jobService.allRelatedContacts().subscribe({
        next: (res) => {
          this.RelatedContactId = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getAllcontacts() {
    this.subscriptions.add(
      this.contactService.allResult().subscribe({
        next: (res) => {
          console.log("Contacts: ", res.payload);
          this.PrimaryContacts = res.payload.map(contact => ({
            id: contact.id,
            name: contact.firstName + ' ' + contact.lastName
          }));
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getTeamMembers() {
    this.subscriptions.add(
      this.jobService.allTeamMembers().subscribe({
        next: (res) => {
          this.TeamMememberId = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }


  addLineItem() {
    if (this.lineItemForm.valid) {
      const newItem = this.lineItemForm.value;
      this.lineItems.push(newItem);
      this.lineItemForm.reset();
    }
  }

  openNotesModal() {
    const dialogRef = this.dialog.open(NotesModalComponent, {
      width: '400px',
      data: { },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Notes added:', result);
        this.notes.push(result);
      }
    });
  }

  editNoteModal(index: number) {
    const noteToEdit = this.notes[index];

    const dialogRef = this.dialog.open(NotesModalComponent, {
      width: '400px',
      data: {...noteToEdit },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Note updated:', result);
        this.notes[index] = result; 
      }
    });
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
  }

  editLineItem(index: number) {
    const itemToEdit = this.lineItems[index];
    this.lineItemForm.patchValue(itemToEdit);
    this.deleteLineItem(index);
  }

  deleteLineItem(index: number) {
    this.lineItems.splice(index, 1);
  }

  getAllJobs() {
    this.jobService.getAllJobsByCompanyID().subscribe(
      (res: any) => {
        this.Jobs = res.map(
          (job: { id: number; name: string; subContractorId: number }) => {
            return {
              id: job.id,
              name: job.name,
              contactId: job.subContractorId,
            };
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  closeAddWorkOrderModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.workOrderForm.markAllAsTouched();
    if (this.workOrderForm.valid) {
      this.workOrderDto = this.workOrderForm.value;
      this.workOrderDto.jobId = Number(this.workOrderForm.value.jobId)
      this.workOrderDto.workflowId = Number(this.workOrderForm.value.workflowId)
      this.workOrderDto.workOrderStatus = Number(this.workOrderForm.value.workOrderStatus)
      this.workOrderDto.lineItems = this.lineItems;
      this.workOrderDto.notes = this.notes;
      console.log(JSON.stringify(this.workOrderDto))
      this.modelMain.actionObj = this.workOrderDto;
      this.dialogRef.close(this.workOrderDto);
    }
  }


  ngOnDistroy() {
    this.subscriptions.unsubscribe()
  }
}
