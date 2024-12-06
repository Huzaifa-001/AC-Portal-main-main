import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WorkFlowType } from 'src/app/core/interfaces';
import { ContactService } from 'src/app/core/services/contact.service';
import { JobService } from 'src/app/core/services/job.service';
import { WorkflowService } from 'src/app/core/workflow.service';
import { AddJobWorkOrderComponent } from '../add-job-work-order/add-job-work-order.component';
import { createWorkOrderDto } from '../createWorkOrderDto';
import { NotesModalComponent } from '../notes-modal/notes-modal.component';
import { Priorities } from '../Common/common';
import { DynamicField, EntityTypes, FieldTypes } from '../../custom-fields/common';
import { FieldService } from 'src/app/core/services/field.service';

@Component({
  selector: 'app-workorder-detail-page',
  templateUrl: './workorder-detail-page.component.html',
  styleUrls: ['./workorder-detail-page.component.css']
})
export class WorkorderDetailPageComponent {
  private subscriptions: Subscription = new Subscription();
  disableSelect = new FormControl(true);
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
  existingWorkOrder: any;

  constructor(
    private dialogRef: MatDialogRef<WorkorderDetailPageComponent>,
    private jobService: JobService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private workFlowService: WorkflowService,
    private contactService: ContactService,
    private fieldService: FieldService,


  ) {
    this.fieldsValueForm = this.formBuilder.group({});
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);

    }

    this.prioritykeys = Object.keys(this.priorities);
  }

  ngOnInit(): void {
    this.workOrderForm = new FormGroup({
      id: new FormControl({ value: 0, disabled: true }), // Disable the control
      name: new FormControl({ value: '', disabled: true }), // Disable the control
      workflowId: new FormControl({ value: 0, disabled: true }), // Disable the control
      workOrderStatus: new FormControl({ value: 0, disabled: true }), // Disable the control
      teamMemberId: new FormControl({ value: [], disabled: true }), // Disable the control
      subContractorId: new FormControl({ value: [], disabled: true }), // Disable the control
      workOrderPriority: new FormControl({ value: '', disabled: true }), // Disable the control
      jobId: new FormControl({ value: this.modelMain.jobId, disabled: true }), // Disable the control
      startDate: new FormControl({ value: '', disabled: true }), // Disable the control
      dueDate: new FormControl({ value: '', disabled: true }), // Disable the control
      lastStatusChangeDate: new FormControl({ value: '', disabled: true }), // Disable the control
      contactId: new FormControl({ value: 0, disabled: true }), // Disable the control
    });

    this.lineItemForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      quantity: new FormControl(0, [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
    });

    this.getWorkflows()
    this.getAllcontacts()
    this.getSubcontractors()
    this.getRelatedcontacts()
    this.getTeamMembers()
    this.getAllJobs()
    this.getWorkOrderById()


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
      isDeleted: new FormControl(true), // Default value for isDeleted
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

  fields: DynamicField[] = []
  fieldsValueForm: FormGroup<{}>;
  existingCustomFieldsValues: any;
  handleCustomFields() {
    this.subscriptions.add(
      this.fieldService.getFieldsByEntityType(EntityTypes.WorkOrder).subscribe({
        next: (res) => {
          debugger
          this.fields = res
          if (this.existingWorkOrder.id) {
            this.existingCustomFieldsValues = this.existingWorkOrder?.customFieldValues || [];
            this.fields.forEach(field => {
              const validators = field.isRequired ? [Validators.required] : [];
              const existingFieldValue = this.existingCustomFieldsValues.find(value => value.fieldDefinitionId === field.id)?.fieldValue;
              let existingValue: any = '';
              if (existingFieldValue) {
                try {
                  existingValue = field.multiSelect ? JSON.parse(existingFieldValue) : existingFieldValue;
                } catch (e) {
                  console.error(`Error parsing field value for field ${field.id}:`, e);
                  existingValue = '';
                }
              }
              if (field.fieldType === FieldTypes.Dropdown && !field.multiSelect) {
                existingValue = Number(existingValue);
              }
              if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
                const valueArray = Array.isArray(existingValue) ? existingValue : []; // Ensure it's an array
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl({value: valueArray , disabled: true}, validators));
              } else {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl({value: existingValue, disabled: true}, validators));
              }
            });
          }
          else {
            this.fields.forEach(field => {
              const validators = field.isRequired ? [Validators.required] : [];
              if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl({value: [], disabled: true}, validators));
              } else {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl({value: '', disabled: true}, validators));
              }
            });
          }


        }
      })
    )
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

  getWorkOrderById() {
    this.subscriptions.add(
      this.jobService.getWorkOrderById(this.updateData.id).subscribe({
        next: (res) => {
          if (this.updateData) {
            this.existingWorkOrder = res.data
            this.lineItems = this.existingWorkOrder.lineItems ?? []
            this.notes = this.existingWorkOrder.notes ?? []
            this.workOrderForm.patchValue(this.existingWorkOrder);
            this.getStatuses(this.existingWorkOrder.workflowId);
            this.handleCustomFields()
          }
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
      data: { /* Pass any necessary data */ },
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
      data: { /* Pass any necessary data for editing */ ...noteToEdit },
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

  ngOnDistroy() {
    this.subscriptions.unsubscribe()
  }
}
