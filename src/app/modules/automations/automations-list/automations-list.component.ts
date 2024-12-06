import { Component, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAutomationComponent } from '../add-automation/add-automation.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { ContactService } from 'src/app/core/services/contact.service';
import { WorkflowService } from 'src/app/core/workflow.service';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';
import { AppConfig } from 'src/app/core/app-config';
import { MatDialog } from '@angular/material/dialog';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { forkJoin, map } from 'rxjs';
import { WorkFlowType } from 'src/app/core/interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-automations-list',
  templateUrl: './automations-list.component.html',
  styleUrls: ['./automations-list.component.css']
})
export class AutomationsListComponent {
  @ViewChild('automationsTable') table!: HTMLTableElement;

  automations: any[] = [];
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  allStatuses: any[] = [];
  allSalesReps: any[] = [];
  allSubcontractors: any[] = [];
  allRelatedContacts: any[] = [];
  allResources: any[] = [];
  allContactWorkFlows: any[] = [];
  allJobWorkFlows: any[] = [];
  allWorkOrderWorkFlows: any[] = [];
  allGlobalWorkFlows: any[] = [];
  tempGridData: any[] = [];
  constructor(
    private router: Router,
    private contactService: ContactService,
    private workflowService: WorkflowService,
    private toastr: ToastrService,
    private templateService: AutomationAndTemplateService,

    private dialog: MatDialog,
    private csvExportService: CsvExportService
  ) { }
  ngOnInit() {
    this.fetchData()
  }

  getAllAutomations() {
    this.templateService.getAllAutomations().subscribe({
      next: (res) => {
        if(res.data.length > 0){
        res.data.forEach(automation => {
          automation.actions.forEach(action => {
            try {
              action.actionObj = JSON.parse(action.actionObj);
            } catch (error) {
              console.error("Error parsing actionObj:", action.actionObj);
            }
          })
        })

        this.automations = res.data;


        this.automations.forEach(x => {
          x.conditions.forEach(y => {
            try {
              switch (y.field) {
                case 'status':
                  y.fieldName = "Status"
                  y.fieldValue = this.allStatuses.find(s => s.id.toString() == y.value).name ?? ""
                  break;
                case 'workflowId':
                  y.fieldName = "WorkFlow"
                  switch (x.triggerRecord) {
                    case 'contact':
                      y.fieldValue = this.allContactWorkFlows.find(s => s.id.toString() == y.value).name ?? ""

                      break;
                    case 'job':
                      y.fieldValue = this.allJobWorkFlows.find(s => s.id.toString() == y.value).name ?? ""

                      break;
                    case 'workorder':
                      y.fieldValue = this.allWorkOrderWorkFlows.find(s => s.id.toString() == y.value).name ?? ""

                      break;
                    default:
                      y.fieldValue = this.allGlobalWorkFlows.find(s => s.id.toString() == y.value).name ?? ""
                      break;
                  }

                  break;
                case 'saleRep':
                  y.fieldName = "Sales Representative"
                  y.fieldValue = this.allSalesReps.find(s => s.id.toString() == y.value).name ?? ""
                  break;
                case 'source':
                  y.fieldName = "Source"
                  y.fieldValue = this.allResources.find(s => s.id.toString() == y.value).name ?? ""
                  break;
                case 'subcontractor':
                  y.fieldName = "Sub Contractor"
                  y.fieldValue = this.allSubcontractors.find(s => s.id.toString() == y.value).name ?? ""
                  break;
                case 'relatedContacts':
                  y.fieldName = "Related Contact"
                  y.fieldValue = this.allRelatedContacts.find(s => s.id.toString() == y.value).name ?? ""
                  break;
                default:
                  y.fieldValue = "unknown"
                  break;
              }
            } catch (error) {
              console.error("Error parsing conditions:");
            }
          })
        });
      }

        

      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

  deleteAutomation(contact: any) {
    let dialogRef: any = {};
    contact.FormTitle = 'Confirm Delete';
    contact.Request_Type = 'Delete';
    dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: contact,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.templateService.deleteAutomation(contact.id).subscribe({
          next: (res) => {
            this.toastr.success('Automation deleted successfully.', 'Success');
            this.getAllAutomations();
          },
          error: (err) => {
            this.toastr.error('Failed to delete automation. Please try again later.', 'Error');
            console.error('Error deleting automation:', err);
          },
        });
      }
      
    });
  }


  loadPagedData(pageIndex: number) {
    const dto = {
      pageIndex: pageIndex,
      pageSize: this.pageSize,
    };

    this.templateService.getAllAutomations().subscribe({
      next: (res) => {
        this.automations = res.data;
        //  this.currentPageIndex = res.pageIndex;
        //  this.totalCount = Math.ceil(res.count / res.pageSize);
      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

  openAddAutomationModal(data: any): void {
    debugger
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Add Automation';
      data.Request_Type = 'Add';
      data.boardId = 0
      dialogRef = this.dialog.open(AddAutomationComponent, {
        width: '70vw',
        data: data,
        disableClose: true,
      });
    } else {
      data = this.automations.find(x => x.id == data.id)
      data.FormTitle = 'Edit Automation';
      data.Request_Type = 'Save';
      dialogRef = this.dialog.open(AddAutomationComponent, {
        width: '70vw',
        data: data,
        disableClose: true,
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      // this.loadPagedData(this.currentPageIndex)
      this.getAllAutomations()
    });
  }

  searchText = ""
  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }


  fetchData() {
    forkJoin([
        this.getAllStatuses(),
        this.getAllSalesReps(),
        this.getAllSubcontractors(),
        this.getRelatedContactsDropDown(),
        this.getAllResources(),
        this.getAllWorkFlows(WorkFlowType.contact),
        this.getAllWorkFlows(WorkFlowType.jobs),
        this.getAllWorkFlows(WorkFlowType.workOrder),
        this.getAllWorkFlows(WorkFlowType.global),
    ]).subscribe({
       next: (results: any[]) => {
            this.allStatuses = results[0];
            this.allSalesReps = results[1];
            this.allSubcontractors = results[2];
            this.allRelatedContacts = results[3];
            this.allResources = results[4];
            this.allContactWorkFlows = results[5];
            this.allJobWorkFlows = results[6];
            this.allWorkOrderWorkFlows = results[7];
            this.allGlobalWorkFlows = results[8];
            this.getAllAutomations()
        },
        error: (error) => {
            console.error('Error fetching data:', error);
        }
      }
    );
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

  getAllWorkFlows(recordType: number) {
    return this.workflowService.getWorkFlowByType(recordType).pipe(
      map(res => res.payload?.map(x => ({ name: x.workFlowName, id: x.id }) ?? []))
    );
  }

  markAutomationActiveOrNot(item){
    let dialogRef: any = {};
    item.FormTitle = 'Confirm Delete';
    item.Request_Type = item.isActive == true ? 'activate' : 'deactivate';
    item.message = `Are you sure you want to ${item.Request_Type} this automation?`;
    dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '32vw',
      height: '200px',
      data: item,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const data = {
          id : item.id,
          isActive : item.isActive
        }
        this.templateService.updateAutomationStatus(data).subscribe(res => {
          this.toastr.success("Operation Susscessfull")
        })
      } else {
        item.isActive = !item.isActive
      }
      item.message = null
      console.log(item.isActive)
    });
  }
}
