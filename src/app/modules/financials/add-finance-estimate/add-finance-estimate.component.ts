
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from 'src/app/core/app-config';
import { DynamicField, EntityTypes, FieldTypes } from '../../custom-fields/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from './../../../core/services/contact.service';
import { FieldService } from 'src/app/core/services/field.service';
import { CreatePhoneNumbersDto } from '../../contact/CreatePhoneNumbersDto';
import { CreateContactDto } from '../../contact/CreateContactDto';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-finance-estimate',
  templateUrl: './add-finance-estimate.component.html',
  styleUrls: ['./add-finance-estimate.component.css']
})
export class AddFinanceEstimateComponent  implements OnInit {
  private subscriptions: Subscription = new Subscription();
  contactForm!: FormGroup;
  phoneNumbersForm!: FormGroup;
  contactDto?: CreateContactDto;
  phoneTypes: any[] = [];
  phoneNumbers: {
    id: string;
    phoneNumber: string;
    typeId: string;
    typeName: string;
  }[] = [];
  ph: CreatePhoneNumbersDto[] = [];
  updateData: any = {};
  //-----------

  //-----------DropDowns
  salesReps: any;
  officeLocations: any;
  workflows: any;
  statuses: any;
  subcontractors: any;
  relatedcontacts: any;
  teamMembers: any;
  sources: any;
  states: any;
  //-----------DropDowns
  //---------Patch
  //-------------------
  imagePath: any = 'assets/images/5.png'; // initialize with a default image
  @ViewChild('fileInput') fileInput: any;
  displayNameAutoUpdated: boolean = true;

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePath = reader.result);
      reader.readAsDataURL(file);
    }
  }

  //--------------------

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AddFinanceEstimateComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public contactService: ContactService,
   
    private route: ActivatedRoute,
    private fieldService: FieldService,
  ) {
    this.fieldsValueForm = this.formBuilder.group({});
    if (data) {
      this.updateData = data;
    }
  }

  get ssForm() {
    return this.contactForm.controls;
  }

  ngOnInit(): void {
    this.phoneNumbersForm = new FormGroup({
      phoneNumber: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      typeId: new FormControl('', Validators.required),
    });

    this.contactForm = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      company: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl(''),
      email: new FormControl(''),
      website: new FormControl(''),
      faxNo: new FormControl(''),
      displayName: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      discription: new FormControl(''),
      homeNumber: new FormControl(''),
      officeNumber: new FormControl(''),
      file: new FormControl(''),
      sourceId: new FormControl(''),
      stateId: new FormControl(''),
      salesRepId: new FormControl(''),
      subContractorId: new FormControl(''),
      teamMembers: new FormControl([]),
      officeLocationId: new FormControl(''),
      workFlowId: new FormControl('', Validators.required),
      statusId: new FormControl(''),
      relatedContacts: new FormControl([]),
      tags: new FormControl([]),
      note: new FormControl(''),
      phoneNumbers: new FormControl([this.createPhoneNumberFormGroup()]),
      customFields: new FormControl([
        //this.createCustomFieldFormGroup()
      ]),
    });

    Promise.all([
      this.getOfficeLocation(),
      this.getSalesRep(),
    
      this.getSubcontractors(),
      this.getRelatedcontacts(),
      this.getTeamMembers(),
      this.getSources(),
      this.getState(),
      this.getPhoneTypes(),
    ])
      .then(() => {
        console.log(this.updateData);
        // All asynchronous functions have completed
        if (this.updateData && this.updateData?.id) {
          debugger
          this.imagePath = this.updateData.picUrl
          if (this.updateData?.workFlow?.id) {
            this.getStatuses(this.updateData?.workFlow?.id)
          }
          this.contactForm.setValue({
            id: this.updateData?.id,
            firstName: this.updateData?.firstName,
            lastName: this.updateData?.lastName,
            company: this.updateData?.company,
            addressLine1: this.updateData?.addressLine1,
            addressLine2: this.updateData?.addressLine2,
            city: this.updateData?.city,
            zipCode: this.updateData?.zipCode,
            email: this.updateData?.email,
            website: this.updateData?.website,
            faxNo: this.updateData?.faxNo,
            displayName: this.updateData?.displayName,
            startDate: this.updateData?.startDate,
            endDate: this.updateData?.endDate,
            discription: this.updateData?.discription ?? '',
            file: this.updateData?.file ?? '',
            sourceId: this.updateData?.source?.id ?? '',
            stateId: this.updateData?.state?.id ?? '',
            salesRepId: this.updateData?.salesRep?.id ?? '',
            subContractorId: this.updateData?.subContractor?.id ?? '',
            teamMembers: this.updateData?.teamMembers?.map(
              (contact: any) => contact.id
            ) ?? [],
            officeLocationId: this.updateData?.officeLocation?.id ?? '',
            workFlowId: this.updateData?.workFlow?.id ?? '',
            statusId: this.updateData?.status?.id ?? '',
            relatedContacts: this.updateData?.relatedContacts?.map(
              (contact: any) => contact.id
            ) ?? [],
            tags: this.updateData?.tags?.map((tagd: any) => ({
              display: tagd.tag,
              value: tagd.tag,
            })) ?? [],
            note: this.updateData.note,
            phoneNumbers: this.updateData?.phoneNumbers ?? [],
            customFields: this.updateData.customFields ?? [],
            homeNumber: this.updateData?.homeNumber ?? '',
            officeNumber: this.updateData?.officeNumber ?? '',
          });

          this.phoneNumbers = this.updateData?.phoneNumbers?.map(
            (phoneNumber: any) => ({
              id: phoneNumber.id,
              phoneNumber: phoneNumber.phoneNumber,
              typeId: phoneNumber.phoneNumberType.id,
              typeName: phoneNumber.phoneNumberType.value,
            })
          );
        }
        this.handleCustomFields()
      })
      .catch((error) => {
        console.error('An error occurred while fetching data:', error);
      });

    this.contactForm.get('firstName').valueChanges.subscribe(() => {
      this.updateDisplayName();
    });

    this.contactForm.get('lastName').valueChanges.subscribe(() => {
      this.updateDisplayName();
    });

    this.contactForm.get('displayName').valueChanges.subscribe((newValue) => {
      if (!newValue || newValue.trim() === '') {
        this.displayNameAutoUpdated = true;
      } else {
        this.displayNameAutoUpdated = false;
      }
    });

  }

  fields: DynamicField[] = []
  fieldsValueForm: FormGroup<{}>;
  existingCustomFieldsValues: any;
  handleCustomFields() {
    this.subscriptions.add(
      this.fieldService.getFieldsByEntityType(EntityTypes.Contact).subscribe({
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


  updateDisplayName() {
    const firstName = this.contactForm.get('firstName').value;
    const lastName = this.contactForm.get('lastName').value;
    const currentDisplayName = this.contactForm.get('displayName').value;
    // Check if the user has not typed into the displayName field or if it's left blank
    if (!currentDisplayName || currentDisplayName.trim() === '' || this.displayNameAutoUpdated) {
      const newDisplayName = `${firstName} ${lastName}`;
      this.contactForm.get('displayName').setValue(newDisplayName, { emitEvent: false });
    }
  }

  createPhoneNumberFormGroup(): FormGroup {
    return new FormGroup({
      typeId: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      typeName: new FormControl('', Validators.required),
    });
  }

  addPhoneNumber(types: any): void {
    debugger
    const phoneNumber = this.phoneNumbersForm.value.phoneNumber.trim();
    const typeId = this.phoneNumbersForm.value.typeId;
    const id = this.phoneNumbersForm.value.id;
    const typeName = types.find((x: any) => x.id === typeId).value;
    if (this.phoneNumbers.find((pn) => pn.phoneNumber === phoneNumber)) {
      const index = this.phoneNumbers.findIndex(
        (pn) => pn.phoneNumber === phoneNumber
      );
      if (index >= 0) {
        this.phoneNumbers.splice(index, 1);
      }
    }

    if (
      phoneNumber &&
      typeId &&
      !this.phoneNumbers.find((pn) => pn.phoneNumber === phoneNumber)
    ) {
      this.phoneNumbers.push({ phoneNumber, typeId, typeName, id });
      this.phoneNumbersForm.reset();
    }
  }

  removePhoneNumber(phoneNumber: string): void {
    const index = this.phoneNumbers.findIndex(
      (pn) => pn.phoneNumber === phoneNumber
    );
    if (index >= 0) {
      this.phoneNumbers.splice(index, 1);
    }
  }

  // formData = new FormData();
  // upload(e: any) {
  //   this.formData.append("file", this.fileInput.nativeElement.files[0]);
  // }

  closeDailog() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    debugger
    this.contactForm.markAllAsTouched();
    console.log(
      this.contactForm.value,
      this.fileInput.nativeElement.files[0],
      this.phoneNumbers
    );

    if (this.contactForm.valid && this.fieldsValueForm.valid) {
      this.contactDto = this.contactForm.value;
      this.contactDto.customFieldValues = this.fields.map(field => {
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

      this.subscriptions.add(
        this.contactService
          .createContact(
            this.contactForm.value,
            this.fileInput.nativeElement.files[0],
            this.phoneNumbers
          )
          .subscribe({
            next: (res) => {
              this.snackBar.open(this.updateData?.id ? 'Record updated successfully' : 'Record inserted successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['/contact']);
              this.dialogRef.close();
            },
            error: (err) => {
              console.log(err);
              this.snackBar.open('Error', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            },
            complete: () => {
              // This block will be executed when the observable completes
            },
          })
      );
    }
  }

  //-------------Callings
  getOfficeLocation() {
    this.subscriptions.add(
      this.contactService.allOfficeLocations().subscribe({
        next: (res) => {
          this.officeLocations = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getSalesRep() {
    this.subscriptions.add(
      this.contactService.allSalesRep().subscribe({
        next: (res) => {
          this.salesReps = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

 

  onWorkflowSelectionChange(event: any): void {
    const selectedId = event.value;
    const selectedWorkflow = this.workflows.find(wf => wf.id === selectedId);
    this.getStatuses(selectedId);

    // if (selectedWorkflow) {
    //   this.statuses = selectedWorkflow.statuses;
    // } else {
    //   this.workflowService.getWorkFlowByType(WorkFlowType.global).subscribe({
    //     next: (res) => {
    //       this.getStatuses(selectedId),
    //       this.statuses = res.payload.find(wf => wf.id === selectedId);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   })
    //   console.warn('Selected Workflow not found.');
    // }
  }

  getStatuses(workflowId: any) {
    this.subscriptions.add(
      this.contactService.getStatusesByWorkFlowId(workflowId).subscribe({
        next: (res) => {
          this.statuses = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  //subcontractors
  getSubcontractors() {
    this.subscriptions.add(
      this.contactService.allSubcontractors().subscribe({
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
      this.contactService.getRelatedContactsDropDown().subscribe({
        next: (res) => {
          this.relatedcontacts = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getTeamMembers() {
    this.subscriptions.add(
      this.contactService.allTeamMembers().subscribe({
        next: (res) => {
          this.teamMembers = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getSources() {
    this.subscriptions.add(
      this.contactService.allSource().subscribe({
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

  getPhoneTypes() {
    this.subscriptions.add(
      this.contactService.allphoneTypes().subscribe({
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

  getState() {
    this.subscriptions.add(
      this.contactService.allState().subscribe({
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
    //Unsubscribe All subscriptions
    this.subscriptions.unsubscribe();
  }
}
