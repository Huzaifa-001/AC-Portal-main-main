import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobDTO, WorkFlowType } from 'src/app/core/interfaces';
import { UtilityService } from 'src/app/core/services/shared/UtilityService';
import { Subscription } from 'rxjs';
import { CreatePhoneNumbersDto } from 'src/app/modules/contact/CreatePhoneNumbersDto';
import { JobService } from 'src/app/core/services/job.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { WorkflowService } from 'src/app/core/workflow.service';
import { DynamicField, EntityTypes, FieldTypes } from '../../custom-fields/common';
import { FieldService } from 'src/app/core/services/field.service';

@Component({
  selector: 'app-add-jobs',
  templateUrl: './add-jobs.component.html',
  styleUrls: ['./add-jobs.component.css'],
})
export class AddJobsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  officeLocationDropdownValues: any = [];
  public model: any = {};
  public modelMain: any = {};
  jobForm!: FormGroup;
  phoneNumbersForm!: FormGroup;
  JobDto?: CreateJobDto;
  phoneTypes: any[] = [];
  phoneNumbers: {
    id: string;
    phoneNumber: string;
    typeId: string;
    typeName: string;
  }[] = [];
  ph: CreatePhoneNumbersDto[] = [];
  //-----------DropDowns
  updateData: any = {};
  //-----------DropDowns
  salesReps: any;
  officeLocations: any;
  workflows: any;
  statuses: any;
  subcontractors: any;
  RelatedContactId: any;
  TeamMememberId: any;
  sources: any;
  states: any;
  @ViewChild('fileInput') fileInput: any;
  PrimaryContacts: any;
  selectedWorkflow: any;
  constructor(
    private dialogRef: MatDialogRef<AddJobsComponent>,
    private jobService: JobService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private workFlowService: WorkflowService,
    private fieldService: FieldService,
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService
  ) {
    this.fieldsValueForm = this.formBuilder.group({});
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);
    }
  }

  get ssForm() {
    return this.jobForm.controls;
  }

  closeAddJobsModal() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //this.getCustomFields()
    this.phoneNumbersForm = new FormGroup({
      phoneNumber: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      typeId: new FormControl('', Validators.required),
    });

    //Assigned TO is mendatory
    this.jobForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      primaryContactId: new FormControl('', Validators.required),
      statusId: new FormControl(0, Validators.required),
      sourceId: new FormControl(0, Validators.required),
      salesRepId: new FormControl(null, Validators.required),
      subContractorId: new FormControl(null, Validators.required),
      workFlowId: new FormControl(0, Validators.required),

      TeamMememberId: new FormControl([]),
      RelatedContactId: new FormControl([]),
      zipCode: new FormControl(null),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      faxNo: new FormControl(''),
      officeNumber: new FormControl(''),
      homeNumber: new FormControl(''),
      mobileNumber: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      discription: new FormControl(''),
      stateId: new FormControl(null),
      officeLocationId: new FormControl(null),
      lastStatusChangeDate: new FormControl(new Date()),
      tags: new FormControl([]),
      note: new FormGroup({
        text: new FormControl(''),
      }),

      // custom Fields
    });

    Promise.all([
      this.getOfficeLocation(),
      this.getSalesRep(),
      this.getWorkflows(),
      this.getAllcontacts(),
      this.getSubcontractors(),
      this.getRelatedcontacts(),
      this.getTeamMembers(),
      this.getSources(),
      this.getState(),
      this.getPhoneTypes()
    ])
      .then(() => {
        if (this.updateData.id) {
          console.log('Update Data: ', this.jobForm, this.updateData);
          debugger
          this.jobForm.patchValue({
            id: this.updateData.id,
            addressLine1: this.updateData.address1,
            addressLine2: this.updateData.address2,
            city: this.updateData.city,
            zipCode: this.updateData.zip,
            name: this.updateData.name, // IF null show primary contact name
            startDate: this.updateData.startDate,
            endDate: this.updateData.endDate,
            discription: this.updateData.description,
            sourceId: this.updateData.leadSourceId,
            stateId: this.updateData.stateId,
            salesRepId: this.updateData.salesRepsentativeId,
            subContractorId: this.updateData.subContractorId,
            officeLocationId: this.updateData.officeLocationId,
            primaryContactId: this.updateData.primaryContactId,
            workFlowId: this.updateData.workFlowId,
            statusId: this.updateData.jobStatusId,
            faxNo: this.updateData.faxNo,
            officeNumber: this.updateData.officeNo,
            homeNumber: this.updateData.homeNo,
            mobileNumber: this.updateData.mobileNo,
            TeamMememberId: this.updateData.teamMememberId, //[1,2]
            RelatedContactId: this.updateData.relatedContactId,
            lastStatusChangeDate: this.updateData.lastStatusChangeDate,
          });

          if (!this.jobForm.get('name').value) {
            this.setPrimaryContactName()
          }
          this.getStatuses(this.updateData.workFlowId);
        }
        this.handleCustomFields()
      })
      .catch((error) => {
        console.error('An error occurred while fetching data:', error);
      });
  }


  fields: DynamicField[] = []
  fieldsValueForm: FormGroup<{}>;
  existingCustomFieldsValues: any;
  handleCustomFields() {
    this.subscriptions.add(
      this.fieldService.getFieldsByEntityType(EntityTypes.Job).subscribe({
        next: (res) => {
          this.fields = res
          if (this.updateData.id) {
            this.existingCustomFieldsValues = this.updateData.customFieldValues;
            this.fields.forEach(field => {
              const validators = field.isRequired ? [Validators.required] : [];
              const existingFieldValue = this.existingCustomFieldsValues.find(value => value.fieldDefinitionId === field.id)?.fieldValue;
              let existingValue: any = '';
              debugger
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


  createPhoneNumberFormGroup(): FormGroup {
    return new FormGroup({
      typeId: new FormControl(''),
      phoneNumber: new FormControl(''),
      typeName: new FormControl(''),
    });
  }

  setPrimaryContactName(): void {
    const primaryContactName = this.getPrimaryContactName();
    const currentName = this.jobForm.get('name').value;

    // Check if the 'name' field is empty before updating it
    if (!currentName) {
      this.jobForm.get('name').setValue(primaryContactName);
    }
  }

  // Retrieve the primary contact name based on the selected ID
  private getPrimaryContactName(): string {
    const primaryContactId = this.jobForm.get('primaryContactId').value;
    const selectedContact = this.PrimaryContacts.find(contact => contact.id === primaryContactId);
    return selectedContact ? selectedContact.name : '';
  }

  addPhoneNumber(types: any): void {
    const phoneNumber = this.phoneNumbersForm.value.phoneNumber
      .toString()
      .trim();
    const typeId = this.phoneNumbersForm.value.typeId;
    const id = this.phoneNumbersForm.value.id;
    const typeName = types.find((x: any) => x.id === typeId)?.value;
    if (!phoneNumber || !typeId) {
      return;
    }
    // Check if the phoneNumber already exists in the phoneNumbers array and remove it
    const existingPhoneNumberIndex = this.phoneNumbers.findIndex(
      (pn) => pn.phoneNumber === phoneNumber
    );
    if (existingPhoneNumberIndex >= 0) {
      this.phoneNumbers.splice(existingPhoneNumberIndex, 1);
    }
    // Add the new phoneNumber to the phoneNumbers array
    this.phoneNumbers.push({ phoneNumber, typeId, typeName, id });
    this.phoneNumbersForm.reset();
  }

  removePhoneNumber(phoneNumber: string): void {
    const index = this.phoneNumbers.findIndex(
      (pn) => pn.phoneNumber === phoneNumber
    );
    if (index >= 0) {
      this.phoneNumbers.splice(index, 1);
    }
  }

  getOfficeLocation() {
    this.subscriptions.add(
      this.jobService.allOfficeLocations().subscribe(
        (res) => {
          this.officeLocationDropdownValues = res.payload;
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  onWorkflowSelectionChange(event: any): void {
    const selectedId = event.value;
    this.selectedWorkflow = this.workflows.find(wf => wf.id === selectedId);
    this.getStatuses(selectedId)
  }

  onSubmit(requestType: string): void {
    this.jobForm.markAllAsTouched();
    if (this.jobForm.valid && this.fieldsValueForm.valid) {
      this.JobDto = this.jobForm.value;
      const requestBody: JobDTO = {
        id: this.JobDto.id,
        address1: this.JobDto.addressLine1,
        address2: this.JobDto.addressLine2,
        city: this.JobDto.city,
        zip: this.JobDto.zipCode,
        faxNo: this.JobDto.faxNo,
        mobileNo: this.JobDto.mobileNumber,
        officeNo: this.JobDto.officeNumber,
        homeNo: this.JobDto.homeNumber,
        name: this.JobDto.name,
        stateId: this.JobDto.stateId,
        startDate: this.JobDto?.startDate ? new Date(this.JobDto.startDate).toISOString() : null,
        endDate: this.JobDto?.endDate ? new Date(this.JobDto.endDate).toISOString() : null,
        description: this.JobDto.discription,
        leadSourceId: Number(this.JobDto.sourceId ?? "0"),
        salesRepsentativeId: this.JobDto.salesRepId,
        officeLocationId: this.JobDto.officeLocationId,
        workFlowId: this.JobDto.workFlowId,
        subContractorId: this.JobDto.subContractorId,
        teamMememberId: this.JobDto.TeamMememberId,
        relatedContactId: this.JobDto.RelatedContactId,
        lastStatusChangeDate: new Date(this.JobDto.lastStatusChangeDate).toISOString(),
        primaryContactId: this.JobDto.primaryContactId,
        jobStatusId: this.JobDto.statusId,
        phoneNo: '',
        jobType: "",
        note: this.JobDto.note?.text ?? ""
      };

      requestBody.customFieldValues = this.fields.map(field => {
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

      if (requestType === 'Add') {
        console.log(JSON.stringify(requestBody))
        this.subscriptions.add(
          this.jobService.createJob(requestBody, this.phoneNumbers).subscribe({
            next: (res) => {
              this.utilityService.showSuccessSnackBar(
                'Record inserted successfully'
              );
              this.router.navigate(['/jobs']);
              this.dialogRef.close();
            },
            error: (err) => {
              console.log(err);
              this.utilityService.showErrorSnackBar(
                'Error occured while adding job.'
              );
              this.router.navigate(['/jobs']);
              this.dialogRef.close();
            },
          })
        );
      } else {
        this.subscriptions.add(
          this.jobService.updateJob(requestBody, this.phoneNumbers).subscribe({
            next: (res) => {
              this.utilityService.showSuccessSnackBar(
                'Record updated successfully.'
              );
              this.router.navigate(['/jobs']);
              this.dialogRef.close();
            },
            error: (err) => {
              this.utilityService.showErrorSnackBar(
                'Error occured while updating record.'
              );
              this.router.navigate(['/jobs']);
              this.dialogRef.close();
            },
          })
        );
      }
    }
  }

  getSalesRep() {
    this.subscriptions.add(
      this.jobService.allSalesRep().subscribe({
        next: (res) => {
          this.salesReps = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getWorkflows() {
    this.subscriptions.add(
      this.workFlowService.getWorkFlowByType(WorkFlowType.jobs).subscribe({
        next: (res) => {
          this.workflows = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
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

  getPhoneTypes() {
    this.subscriptions.add(
      this.jobService.allphoneTypes().subscribe({
        next: (res) => {
          const sourcePhoneTypes = res.payload[0].dropDown.find(
            (dropdown: any) => dropdown.dropDownName === 'MobileType'
          );
          this.phoneTypes = sourcePhoneTypes.dropDownValues;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getSources() {
    this.subscriptions.add(
      this.jobService.allSource().subscribe({
        next: (res) => {
          const sourceTypeDropdown = res.payload[0].dropDown.find(
            (dropdown: any) => dropdown.dropDownName === 'SourceType'
          );
          this.sources = sourceTypeDropdown.dropDownValues;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }
  getState() {
    this.subscriptions.add(
      this.jobService.allState().subscribe({
        next: (res) => {
          this.states = res.payload;
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
}
