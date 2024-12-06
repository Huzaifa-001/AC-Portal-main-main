import { Component, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { WorkFlowType } from 'src/app/core/interfaces';
import { AccountService } from 'src/app/core/services/account.service';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { JobService } from 'src/app/core/services/job.service';
import { WorkflowService } from 'src/app/core/workflow.service';

@Component({
  selector: 'app-change-field',
  templateUrl: './change-field.component.html',
  styleUrls: ['./change-field.component.css']
})
export class ChangeFieldComponent {
  modelData: any
  allStatuses: any[] = [];
  allSalesReps: any[] = [];
  allRelatedContacts: any[] = [];
  allResources: any[] = [];
  allSubcontractors: any[] = [];
  allWorkflows: any[] = [];
  changeFieldForm: FormGroup;

  jobFields = [
    { value: 'Name', label: 'Name' },
    { value: 'Address1', label: 'Address 1' },
    { value: 'Address2', label: 'Address 2' },
    { value: 'City', label: 'City' },
    { value: 'FaxNo', label: 'Fax No' },
    { value: 'MobileNo', label: 'Mobile No' },
    { value: 'HomeNo', label: 'Home No' },
    { value: 'OfficeNo', label: 'Office No' },
    { value: 'PhoneNo', label: 'Phone No' },
    { value: 'Zip', label: 'ZIP' },
    { value: 'Description', label: 'Description' },

    { value: 'StartDate', label: 'Start Date' },
    { value: 'EndDate', label: 'End Date' },

    { value: 'StateId', label: 'State' },
    { value: 'JobStatusId', label: 'Status' },
    { value: 'LeadSourceId', label: 'Lead Source' },
    { value: 'SalesRepsentativeId', label: 'Sales Representative' },
    { value: 'PrimaryContactId', label: 'Primary Contact' },
    { value: 'OfficeLocationId', label: 'Office Location' },
    { value: 'SubContractorId', label: 'Sub Contractor' },

    { value: 'TeamMemberIds', label: 'Team Members' },
    { value: 'RelatedContactIds', label: 'Related Contacts' },
  ];


  workorderFields = [
    { value: 'Name', label: 'Name' },
    { value: 'WorkOrderPriority', label: 'Work Order Priority' },
    { value: 'WorkOrderStatus', label: 'Work Order Status' },
    { value: 'StartDate', label: 'Start Date' },
    { value: 'DueDate', label: 'Due Date' },
    { value: 'TeamMemberIds', label: 'Team Members' },

    // { value: 'Notes', label: 'Notes' },
    // { value: 'LastStatusChangeDate', label: 'Last Status Change Date' },
    // { value: 'ContactId', label: 'Contact ID' },
    // { value: 'JobId', label: 'Job ID' }
  ];

  contactFields = [
    { value: 'FirstName', label: 'First Name' },
    { value: 'LastName', label: 'Last Name' },
    { value: 'Company', label: 'Company' },
    { value: 'AddressLine1', label: 'Address Line 1' },
    { value: 'AddressLine2', label: 'Address Line 2' },
    { value: 'City', label: 'City' },
    { value: 'ZipCode', label: 'ZIP Code' },
    { value: 'Email', label: 'Email' },
    { value: 'Website', label: 'Website' },
    { value: 'FaxNo', label: 'Fax No' },
    { value: 'DisplayName', label: 'Display Name' },
    { value: 'Discription', label: 'Description' },


    { value: 'StartDate', label: 'Start Date' },
    { value: 'EndDate', label: 'End Date' },

    { value: 'SourceId', label: 'Source ID' },
    { value: 'StateId', label: 'State ID' },
    { value: 'SalesRepId', label: 'Sales Representative ID' },
    { value: 'SubContractorId', label: 'Sub Contractor ID' },
    { value: 'OfficeLocationId', label: 'Office Location ID' },
    { value: 'StatusId', label: 'Status ID' },
    { value: 'TeamMemberIds', label: 'Team Members' },
    { value: 'RelatedContactIds', label: 'Related Contacts' },
  ];

  allOfficeLocations: any[] = [];
  allStates: any[] = [];
  allLeadSources: any[] = [];
  TeamMembers: any[] = [];
  RelatedContacts: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ChangeFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contactService: ContactService,
    public jobService: JobService,
    public toastr: ToastrService,
    public workflowService: WorkflowService,
    private fb: FormBuilder) {
    this.modelData = data
    debugger
    this.changeFieldForm = this.fb.group({
      fields: this.fb.array([])
    });
    this.fetchData()


  }


  @ViewChildren(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  // Function to toggle menu
  toggleDropdown() {
    this.menuTrigger.openMenu();
  }

  get fieldsFormArray(): FormArray {
    return this.changeFieldForm.get('fields') as FormArray;
  }

  appendTemplate(form: any, selectedField: string, templateId: string) {
    let currentTitle = (form.get('newValue').value ?? "").trim();
    const templateValue = `{{${templateId}}}`;
    if (form.get('selectedField').value === selectedField) {
      if (currentTitle.length > 0) {
        currentTitle += ' ' + templateValue;
      } else {
        currentTitle = templateValue;
      }
      form.get('newValue').setValue(currentTitle);
    }
  }


  addField() {
    const fieldGroup = this.fb.group({
      selectedField: [''],
      newValue: ['']
    });
    this.fieldsFormArray.push(fieldGroup);
  }

  removeField(index: number) {
    this.fieldsFormArray.removeAt(index);
  }

  onSubmit() {
    const updatedFields = this.fieldsFormArray.value.reduce((acc: any, field: any) => {
      if (field.selectedField === 'JobStatusId' && this.fetchRecordType() == WorkFlowType.jobs) {
        const selectedStatus = this.allStatuses.find(status => status.id === field.newValue);
        if (selectedStatus) {
          acc['WorkFlowId'] = selectedStatus.workflowId;
        }
      } else if (field.selectedField === 'WorkOrderStatus' && this.fetchRecordType() == WorkFlowType.workOrder) {
        const selectedStatus = this.allStatuses.find(status => status.id === field.newValue);
        if (selectedStatus) {
          acc['WorkFlowId'] = selectedStatus.workflowId;
        }
      } else if (field.selectedField === 'StatusId' && this.fetchRecordType() == WorkFlowType.contact) {
        const selectedStatus = this.allStatuses.find(status => status.id === field.newValue);
        if (selectedStatus) {
          acc['WorkFlowId'] = selectedStatus.workflowId;
        }
      }
      acc[field.selectedField] = field.newValue;
      return acc;
    }, {});

    const result = {
      Changes: updatedFields
    };

    this.dialogRef.close(result);
    console.log('Updated Fields:', result);
  }



  fetchData() {
    this.getState()
    this.getOfficeLocation()
    this.getAllLeadSources()
    this.getTeamMembers()
    this.getAllRelatedContacts()
    forkJoin([
      this.getAllWorkFlows(),
      this.getAllSalesReps(),
      this.getAllSubcontractors(),
      this.getRelatedContactsDropDown(),
      this.getAllResources()
    ]).subscribe({
      next: (results: any[]) => {
        const workFlowType = this.fetchRecordType();
        const filteredWorkflows = results[0].filter(workflow => workflow.workFlowType === workFlowType);
        this.allWorkflows = filteredWorkflows.map(workflow => ({
          name: workflow.workFlowName,
          id: workflow.id
        }));

        filteredWorkflows.forEach(workflow => {
          workflow.statuses.forEach(status => {
            this.allStatuses.push({
              name: `${status.statusName} (${workflow.workFlowName})`,
              id: status.id,
              workflowId: workflow.id
            });
          });
        });

        this.allSalesReps = results[1];
        this.allSubcontractors = results[2];
        this.allRelatedContacts = results[3];
        this.allResources = results[4];

        if (this.modelData.isUpdate) {
          this.updateFormFromActionObj(this.modelData.actionObj.Changes)
        } else {
          this.addField()

        }

      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }


  updateFormFromActionObj(changes: any) {
    const fieldsFormArray = this.fieldsFormArray;
    while (fieldsFormArray.length !== 0) {
      fieldsFormArray.removeAt(0);
    }
    Object.keys(changes).forEach(key => {
      const newValue = changes[key];
      const fieldGroup = this.fb.group({
        selectedField: [key],
        newValue: [newValue]
      });
      fieldsFormArray.push(fieldGroup);
    });
  }

  getAllResources() {
    return this.contactService.allSource().pipe(
      map(res => {
        const sourceTypeDropdown = res.payload[0].dropDown.find(
          (dropdown: any) => dropdown.dropDownName === 'SourceType'
        );
        return sourceTypeDropdown.dropDownValues.map(x => ({ name: x.value, id: x.id }));
      }));
  }

  getAllStatuses() {
    return this.contactService.allStatus().pipe(
      map(res => res.payload.map(x => ({ name: x.statusName + " (" + x.workFlowName + ")", id: x.id })))
    );
  }

  getAllSalesReps() {
    return this.contactService.allSalesRep().pipe(
      map(res => res.payload.map(x => ({ name: x.name, id: x.id })))
    );
  }

  getAllSubcontractors() {
    return this.contactService.allSubcontractors().pipe(
      map(res => res.payload.map(x => ({ name: x.name, id: x.id })))
    );
  }

  getRelatedContactsDropDown() {
    return this.contactService.getRelatedContactsDropDown().pipe(
      map(res => res.payload.map(x => ({ name: x.name, id: x.id })))
    );
  }

  getAllWorkFlows() {
    return this.workflowService.getAllWorkFlows().pipe(
      map(res => res.payload)
    );
  }

  getOfficeLocation() {
    this.jobService.allOfficeLocations().subscribe(
      (res) => {
        this.allOfficeLocations = res.payload;
        console.log("allOfficeLocations", JSON.stringify(this.allOfficeLocations));

      },
      (err) => {
        console.log(err);
      }
    )
  }

  getTeamMembers() {
    this.jobService.allTeamMembers().subscribe({
      next: (res) => {
        this.TeamMembers = res.payload;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }


  getAllRelatedContacts() {
    this.jobService.allRelatedContacts().subscribe({
      next: (res) => {
        this.RelatedContacts = res.payload;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }


  getAllLeadSources() {
    this.jobService.allSource().subscribe({
      next: (res) => {
        const sourceTypeDropdown = res.payload[0].dropDown.find(
          (dropdown: any) => dropdown.dropDownName === 'SourceType'
        );
        this.allLeadSources = sourceTypeDropdown.dropDownValues;
        console.log("allLeadSources", JSON.stringify(this.allLeadSources));

      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  getState() {
    this.jobService.allState().subscribe({
      next: (res) => {
        this.allStates = res.payload;


        console.log("allstates", JSON.stringify(this.allStates));

      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  fetchRecordType() {
    switch (this.modelData.TriggerRecord) {
      case 'contact':
        return WorkFlowType.contact
      case 'job':
        return WorkFlowType.jobs
      case 'workorder':
        return WorkFlowType.workOrder
      default:
        return WorkFlowType.global
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
