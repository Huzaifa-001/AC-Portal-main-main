import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, subscribeOn } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { AddcontactComponent } from '../../contact/addcontact/addcontact.component';
import { WorkflowService } from 'src/app/core/workflow.service';
import { WorkFlowType } from 'src/app/core/interfaces';
import { method, update } from 'lodash';
import { MatMenuTrigger } from '@angular/material/menu';


export interface BoardDTO {
  id: number;
  projectName: string;
  projectType: string;
  projectColor: string;
  backgroundImageUrl: string;
  accessUsers: any[];
  cardTitle: string;
  statuses: StatusDTO[];
  folderId: any;
}

export interface StatusDTO {
  id: number;
  name: string;
  sortBy: string;
  sortingOrder: string;
  total?: string;
  workFlowStatuses: WorkFlowStatusDTO[];
}

export interface WorkFlowStatusDTO {
  id: number;
  statusName: string;
  workFlowName: string;
  workFlowId: string;
  WorkFlowStatusId: number
}



@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.css']
})
export class AddBoardComponent {
  selectedFiles: any[] = [];
  existingImageUrl: any;
  showInsertionRow = false;

  public toggle: boolean = false;
  public rgbaText: string = 'rgba(165, 26, 214, 0.2)';
  public arrayColors: any = {
    color1: '#2883e9',
  };
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  toggleDropdown() {
    this.trigger.openMenu();
  }

  appendTemplate(templateId: string) {
    const currentTitle = this.boardForm.get('cardTitle').value;
    const templateValue = `{{${templateId}}}`;
    this.boardForm.get('cardTitle').setValue(currentTitle + ' ' + templateValue);
    this.boardForm.get('cardTemplates').setValue(currentTitle + ' ' + templateValue);
  }

  public cardTemplates = [
    { id: "firstName", name: "First Name" },
    { id: "lastName", name: "Last Name" },
    { id: "company", name: "Company" },
    { id: "addressLine1", name: "Address Line 1" },
    { id: "addressLine2", name: "Address Line 2" },
    { id: "city", name: "City" },
    { id: "zipCode", name: "ZipCode" },
    { id: "email", name: "Email" },
    { id: "faxNo", name: "FaxNo" },
    { id: "displayName", name: "Display Name" },
    { id: "startDate", name: "Start Date" },
    { id: "endDate", name: "End Date" },
    { id: "lastStatusChangeDate", name: "Last Status Change Date" }

  ]

  showprojectColor = false
  public projectColor: string = '#a897b7';
  public background: string = '#b596b6';
  public selectedColor: string = 'color1';
  private subscriptions: Subscription = new Subscription();

  boardForm!: FormGroup;
  updateData: any;

  showprojectColorPicker: boolean;
  statuForm: FormGroup;
  ContactWorkflows: any;
  WorkOrdersWorkflows: any;
  JobsWorkflows: any;
  projectTypeHasValue: any;
  WorkFlowStatuses: any[] = [];
  PrimaryContacts: any;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AddcontactComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contactService: ContactService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private workflowService: WorkflowService,
  ) {
    if (data) {
      this.updateData = data;
    }
  }

  ngOnInit(): void {
    this.boardForm = new FormGroup({
      id: new FormControl(0),
      projectName: new FormControl('', Validators.required),
      projectType: new FormControl('contact', Validators.required),
      projectColor: new FormControl('#a897b7', Validators.required),
      background: new FormControl('#b596b6', Validators.required),
      accessUserID: new FormControl(''),
      cardTitle: new FormControl('', Validators.required),
      cardTemplates: new FormControl([], Validators.required),
      // backgroundImage: new FormControl(''),
    });

    this.boardForm.get('projectType')?.valueChanges.subscribe((value) => {
      debugger
      if (value) {
        this.onTypeChange(value);
      }
    });

    // this.boardForm.get('cardTemplates')?.valueChanges.subscribe((values: string[]) => {
    //   if (values) {
    //     let currentTitle = this.boardForm.get('cardTitle')?.value || '';
    //     const regex = /\{\{.*?\}\}/g;
    //     currentTitle = currentTitle.replace(regex, '').trim();
    //     const newValues = values.map(value => `{{${value}}}`).join(' ');
    //     const updatedTitle = `${currentTitle} ${newValues}`.trim();
    //     this.boardForm.get('cardTitle')?.setValue(updatedTitle);
    //   }
    // });


    // this.boardForm.get('cardTitle')?.valueChanges.subscribe((value: string) => {
    //   debugger
    //   if (value) {
    //     const regex = /\{\{(.*?)\}\}/g;
    //     let match;
    //     const valuesFromTitle = [];
    //     const invalidValues = [];

    //     while ((match = regex.exec(value)) !== null) {
    //       const val = match[1];
    //       valuesFromTitle.push(val);
    //       if (!this.cardTemplates.some(template => template.id === val)) {
    //         invalidValues.push(val);
    //       }
    //     }

    //     if (invalidValues.length > 0) {
    //       this.boardForm.get('cardTitle')?.setErrors({ 'invalidValues': invalidValues });
    //     } else {
    //       this.boardForm.get('cardTitle')?.setErrors(null);
    //       const cardTemplates = this.boardForm.get('cardTemplates')?.value || [];
    //       const updatedTemplates = [...cardTemplates];

    //       valuesFromTitle.forEach(val => {
    //         if (!updatedTemplates.includes(val)) {
    //           updatedTemplates.push(val);
    //         }
    //       });
    //       this.boardForm.get('cardTemplates')?.setValue(updatedTemplates, { emitEvent: false });
    //     }

    //   }
    // });

    this.statuForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      statuses: new FormControl([], Validators.required),
      sortBy: new FormControl('workFlowName'),
      sortingOrder: new FormControl('asc'),
      total: new FormControl(''),
    });

    this.getAllcontacts()
    this.onTypeChange(this.boardForm.value.projectType);

  }

  statuses: any[] = [];

  AddStatusToList() {
    debugger
    this.statuForm.markAllAsTouched()
    const status = this.statuForm.value;
    if (!this.statuForm.valid || status.statuses?.length == 0)
      return

    if (status.statuses && status.statuses.length > 0) {
      status.workFlowStatuses = status.statuses;
      status.workFlowStatuses.forEach((x: any) => {
        x.WorkFlowStatusId = x.id;
      });
    }
    if (status.id && status.id != 0 && status.id != null && status.id != undefined) {
      const index = this.statuses.findIndex(x => x.id == status.id);
      if (index == -1) {
        this.statuses.push(status);
      }
      else {
        this.statuses[index] = status;
      }
    }
    else if (this.statuses.find(x => x.name == status.name)) {
      const index = this.statuses.findIndex(x => x.name == status.name);
      this.statuses[index] = status;
    }
    else {
      this.statuses.push(status);
    }

    this.resetStatusForm()
  }

  removeFormList(status: any) {
    const index = this.statuses.indexOf(status);
    this.statuses.splice(index, 1);
  }

  editStatus(_t114: any) {
    this.showInsertionRow = true
    this.statuForm.patchValue(_t114);
  }



  closeDailog() {
    this.dialogRef.close();
  }

  toggleColorPicker() {
    this.showprojectColorPicker = !this.showprojectColorPicker
  }


  onFileSelected(event: any) {
    this.selectedFiles = []
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.existingImageUrl = reader.result as string;
          this.selectedFiles.push(file); // Push the file to the selectedFiles array
        };
        reader.readAsDataURL(file);
      }
    }
  }


  deSelectImage() {
    this.selectedFiles = []
    this.existingImageUrl = null
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onTypeChange(type: any) {
    if (type === 'contact') {
      this.getContactStatuses();
      this.cardTemplates = [
        { id: "firstName", name: "First Name" },
        { id: "lastName", name: "Last Name" },
        { id: "company", name: "Company" },
        { id: "addressLine1", name: "Address Line 1" },
        { id: "addressLine2", name: "Address Line 2" },
        { id: "city", name: "City" },
        { id: "zipCode", name: "ZipCode" },
        { id: "email", name: "Email" },
        { id: "faxNo", name: "FaxNo" },
        { id: "displayName", name: "Display Name" },
        { id: "startDate", name: "Start Date" },
        { id: "endDate", name: "End Date" },
        { id: "lastStatusChangeDate", name: "Last Status Change Date" }

      ]
    } else if (type === 'job') {
      this.getJobStatuses();
      this.cardTemplates = [
        { id: "name", name: "Name" },
        { id: "address1", name: "Address 1" },
        { id: "address2", name: "Address 2" },
        { id: "city", name: "City" },
        { id: "faxNo", name: "Fax No" },
        { id: "mobileNo", name: "Mobile No" },
        { id: "homeNo", name: "Home No" },
        { id: "officeNo", name: "Office No" },
        { id: "phoneNo", name: "Phone No" },
        { id: "jobType", name: "Job Type" },
        { id: "note", name: "Note" },
        { id: "zip", name: "Zip" },
        { id: "startDate", name: "Start Date" },
        { id: "endDate", name: "End Date" },
        { id: "lastStatusChangeDate", name: "Last Status Change Date" }
      ];
    } else if (type === 'workorder') {
      this.getWorkOrderStatuses();
      this.cardTemplates = [
        { id: "workOrderPriority", name: "Work Order Priority" },
        { id: "name", name: "Name" },
        { id: "workOrderStatus", name: "Work Order Status" },
        { id: "startDate", name: "Start Date" },
        { id: "dueDate", name: "Due Date" },
        { id: "notes", name: "Notes" },
        { id: "lastStatusChangeDate", name: "Last Status Change Date" }
      ];

    } else {
      this.showInsertionRow = false;
    }
  }

  updateStatuses() {
    if (this.updateData.id > 0 && this.WorkFlowStatuses.length > 0) {
      debugger
      this.updateData.statuses.forEach((x: any) => {
        var status = {
          id: x.id,
          name: x.name,
          statuses: x.workFlowStatuses.map((y: any) => {
            return this.WorkFlowStatuses.find(x => x.id == y.workFlowStatusId)
          }),
          sortBy: x.sortBy,
          sortingOrder: x.sortingOrder,
          total: x.total,
        }
        this.statuForm.patchValue(status)
        this.AddStatusToList()
      })
    }
  }

  getWorkOrderStatuses() {
    this.workflowService.getWorkFlowByType(WorkFlowType.workOrder).subscribe({
      next: (res) => {
        this.projectTypeHasValue = true;
        this.WorkFlowStatuses = res.payload.reduce((statuses, workflow) => {
          workflow.statuses.forEach(status => {
            statuses.push({
              id: status.id,
              statusName: status.statusName,
              workFlowName: workflow.workFlowName, // Include workFlowName
              workFlowId: status.workFlowId      // Include workFlowId
            });
          });
          return statuses;
        }, []);
        this.updateStatuses()

      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

  getJobStatuses() {
    this.workflowService.getWorkFlowByType(WorkFlowType.jobs).subscribe({
      next: (res) => {
        this.projectTypeHasValue = true;
        this.WorkFlowStatuses = res.payload.reduce((statuses, workflow) => {
          workflow.statuses.forEach(status => {
            statuses.push({
              id: status.id,
              statusName: status.statusName,
              workFlowName: workflow.workFlowName, // Include workFlowName
              workFlowId: status.workFlowId      // Include workFlowId
            });
          });
          return statuses;
        }, []);
        this.updateStatuses()

      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

  getContactStatuses() {
    this.workflowService.getWorkFlowByType(WorkFlowType.contact).subscribe({
      next: (res) => {
        this.projectTypeHasValue = true;
        this.WorkFlowStatuses = res.payload.reduce((statuses, workflow) => {
          workflow.statuses.forEach(status => {
            statuses.push({
              id: status.id,
              statusName: status.statusName,
              workFlowName: workflow.workFlowName, // Include workFlowName
              workFlowId: status.workFlowId      // Include workFlowId
            });
          });
          return statuses;
        }, []);
        this.updateStatuses()
        console.log(this.WorkFlowStatuses)
      },
      error: (err) => {
        console.log(err);
      }
    }
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
          if (this.updateData.id > 0) {
            this.projectColor = this.updateData.projectColor ?? '#a897b7';
            this.onTypeChange(this.updateData.projectType)
            this.boardForm.setValue({
              id: this.updateData.id,
              projectName: this.updateData.projectName,
              projectType: this.updateData.projectType,
              projectColor: this.updateData.projectColor,
              background: this.updateData.projectColor ?? '#b596b6',
              accessUserID: this.updateData.accessUsers.map(x => x.accessUserId),
              cardTitle: '',
              cardTemplates: []
            })
            this.boardForm.get('cardTitle')?.setValue(this.updateData.cardTitle);
            this.existingImageUrl = this.updateData.backgroundImageUrl ?? ''
          }
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  onSubmit(): void {
    this.boardForm.markAllAsTouched();
    if (!this.boardForm.valid)
      return

    var data: BoardDTO = {
      id: this.boardForm.value.id,
      projectName: this.boardForm.value.projectName,
      projectType: this.boardForm.value.projectType,
      projectColor: this.boardForm.value.projectColor,
      backgroundImageUrl: this.existingImageUrl,
      accessUsers: this.boardForm.value.accessUserID,
      cardTitle: this.boardForm.value.cardTitle,
      statuses: this.statuses,
      folderId: this.updateData.folderId
    };
    console.log(JSON.stringify(data));

    if (this.boardForm.valid && !this.updateData?.id) {
      this.subscriptions.add(
        this.projectService
          .createBoard(
            data
          )
          .subscribe({
            next: (res) => {
              this.snackBar.open('Record inserted successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['/boards']);
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
    } else {
      this.subscriptions.add(
        this.projectService
          .updateBoard(
            data
          )
          .subscribe({
            next: (res) => {
              this.snackBar.open('Record updated successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['/boards']);
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

  resetStatusForm() {
    this.statuForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),
      statuses: new FormControl([]),
      sortBy: new FormControl(''),
      sortingOrder: new FormControl('asc'),
      total: new FormControl(''),
    });
    this.showInsertionRow = false;
  }
}
