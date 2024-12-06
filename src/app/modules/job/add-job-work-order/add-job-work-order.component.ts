import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateJobDto } from '../CreateJobsDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createWorkOrderDto } from '../createWorkOrderDto';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { JobService } from 'src/app/core/services/job.service';
import { Subscription } from 'rxjs';
import { NotesModalComponent } from '../notes-modal/notes-modal.component';
import { WorkflowService } from 'src/app/core/workflow.service';
import { WorkFlowType } from 'src/app/core/interfaces';
import { ContactService } from 'src/app/core/services/contact.service';
import { Priorities } from '../Common/common';
import { DynamicField, EntityTypes, FieldTypes } from '../../custom-fields/common';
import { FieldService } from 'src/app/core/services/field.service';

@Component({
  selector: 'app-add-job-work-order',
  templateUrl: './add-job-work-order.component.html',
  styleUrls: ['./add-job-work-order.component.css'],
})
export class AddJobWorkOrderComponent {
  private subscriptions: Subscription = new Subscription();

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
    private dialogRef: MatDialogRef<AddJobWorkOrderComponent>,
    private jobService: JobService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private fieldService: FieldService,

    private workFlowService: WorkflowService,
    private contactService: ContactService

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
      id: new FormControl(0),
      name: new FormControl(''),
      workflowId: new FormControl(0),
      workOrderStatus: new FormControl(0),
      teamMemberId: new FormControl([]), // Assuming teamMemberId is a list of IDs
      subContractorId: new FormControl([]), // Assuming subContractorId is a list of IDs
      workOrderPriority: new FormControl(''),
      jobId: new FormControl(this.modelMain.jobId),
      startDate: new FormControl(''),
      dueDate: new FormControl(''),
      //lineItems: new FormControl([this.initLineItem()]),
      // notes: new FormControl([this.initNote()]),
      lastStatusChangeDate: new FormControl(''),
      contactId: new FormControl(0),
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
    if (this.updateData) {
      const existingWorkOrder = this.updateData
      this.lineItems = existingWorkOrder.lineItems ?? []
      this.notes = existingWorkOrder.notes ?? []
      this.workOrderForm.patchValue(existingWorkOrder);
      this.getStatuses(this.updateData.workflowId);
    }
    this.handleCustomFields()
  }

  fields: DynamicField[] = []
  fieldsValueForm: FormGroup<{}>;
  existingCustomFieldsValues: any;
  handleCustomFields() {
    this.subscriptions.add(
      this.fieldService.getFieldsByEntityType(EntityTypes.WorkOrder).subscribe({
        next: (res) => {
          this.fields = res
          if (this.updateData.id) {
            this.existingCustomFieldsValues = this.updateData.customFieldValues;
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
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl(valueArray, validators));
              } else {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl(existingValue, validators));
              }
            });
          }
          else {
            this.fields.forEach(field => {
              const validators = field.isRequired ? [Validators.required] : [];
              if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl([], validators));
              } else {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl('', validators));
              }
            });
          }


        }
      })
    )
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

  onSubmit() {
    this.workOrderForm.markAllAsTouched();
    if (this.workOrderForm.valid && this.fieldsValueForm.valid) {
      this.workOrderDto = this.workOrderForm.value;
      this.workOrderDto.jobId = Number(this.workOrderForm.value.jobId)
      this.workOrderDto.workflowId = Number(this.workOrderForm.value.workflowId)
      this.workOrderDto.workOrderStatus = Number(this.workOrderForm.value.workOrderStatus)
      this.workOrderDto.lineItems = this.lineItems;
      this.workOrderDto.notes = this.notes;

      // Process and prepare customFieldValues for submission or update
      this.workOrderDto.customFieldValues = this.fields.map(field => {
        const fieldControl = this.fieldsValueForm.get(field.id.toString());
        let processedValue: any = fieldControl?.value;
        if (processedValue !== undefined) {
          if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
            processedValue = JSON.stringify(processedValue);
          }
          else if (typeof processedValue === 'string') {
            processedValue = processedValue.replace(/^"(.*)"$/, '$1');
          }
          if (field.fieldType === FieldTypes.Date) {
            const dateValue = new Date(processedValue);
            if (!isNaN(dateValue.getTime())) {
              processedValue = dateValue.toISOString();
            } else {
              console.warn(`Invalid date format: ${processedValue}`);
              processedValue = processedValue;
            }
          }
        }
        return {
          FieldDefinitionId: field.id,
          FieldValue: processedValue.toString()
        };
      });

      console.log(JSON.stringify(this.workOrderDto))

      if (this.workOrderDto.id == 0) {
        this.subscriptions = this.jobService.createWorkOrder(this.workOrderDto).subscribe(
          (res) => {
            this.snackBar.open('Record inserted successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });

            this.dialogRef.close(true);
          },
          (err) => {
            console.log(err);
            this.snackBar.open('Error', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          }
        );
      }
      else {
        this.subscriptions = this.jobService.updateWorkOrder(this.workOrderDto).subscribe(
          (res) => {
            this.snackBar.open('Record inserted successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });

            this.dialogRef.close(true);
          },
          (err) => {
            console.log(err);
            this.snackBar.open('Error', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          }
        );
      }

    }
  }


  ngOnDistroy() {
    this.subscriptions.unsubscribe()
  }
}
