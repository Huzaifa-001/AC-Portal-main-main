import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { AddcontactComponent } from '../../contact/addcontact/addcontact.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { WorkFlowType } from 'src/app/core/interfaces';
import { AddWorkFlowsComponent } from '../add-work-flow/add-work-flow.component';
import { WorkflowService } from 'src/app/core/workflow.service';

@Component({
  selector: 'app-work-orders-tab',
  templateUrl: './work-orders-tab.component.html',
  styleUrls: ['./work-orders-tab.component.css']
})
export class WorkOrdersTabComponent {
  @ViewChild('contactWorkflowTable') table!: HTMLTableElement;

  workflows: any[] = [];
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  constructor(
    private router: Router,
    private contactService: ContactService,
    private workflowService: WorkflowService,
    private dialog: MatDialog,
    private csvExportService: CsvExportService
  ) {}
  ngOnInit() {
    this.getAllWorkFlows()
  }

  getAllWorkFlows(){ 
    this.workflowService.getWorkFlowByType(WorkFlowType.workOrder).subscribe({
      next: (res) => {
         this.workflows = res.payload;
       },
      error: (err) => {
         console.log(err);
       }}
     );
  }

  deleteWorkflow(contact: any) {
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
      debugger
      if (result) {
        this.workflowService.deleteWorkFlow(contact.id).subscribe({
          next: (res) => {
            console.log(res);
            this.getAllWorkFlows()

          },
          error: (res) => {
            console.log(res);
          },
        });
      }
    });
  }


  openAddWorkFlowModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Add WorkOrder WorkFlow';
      data.Request_Type = 'Add';
      data.workFlowType = WorkFlowType.workOrder
      dialogRef = this.dialog.open(AddWorkFlowsComponent, {
        width: '550px',
        height: '80vh',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Edit WorkOrder WorkFlow';
      data.Request_Type = 'Save';
      data.workFlowType = WorkFlowType.workOrder
      dialogRef = this.dialog.open(AddWorkFlowsComponent, {
        width: '550px',
        height: '80vh',
        data: data,
        disableClose: true,
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getAllWorkFlows()
    });
  }

  searchText = ""
  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
  
}
