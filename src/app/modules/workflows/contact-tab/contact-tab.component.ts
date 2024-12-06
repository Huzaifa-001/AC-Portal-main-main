import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { AddcontactComponent } from '../../contact/addcontact/addcontact.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { AddWorkFlowsComponent } from '../add-work-flow/add-work-flow.component';
import { WorkFlowType, Workflow } from 'src/app/core/interfaces';
import { WorkflowService } from 'src/app/core/workflow.service';

@Component({
  selector: 'app-contact-tab',
  templateUrl: './contact-tab.component.html',
  styleUrls: ['./contact-tab.component.css']
})
export class ContactTabComponent {
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

  
  // loadPagedData(pageIndex: number) {
  //   const dto = {
  //     pageIndex: pageIndex,
  //     pageSize: this.pageSize,
  //   };

  //   this.contactService.pagedData(dto).subscribe({
  //     next: (res) => {
  //        this.workflows = res.payload;
  //        this.currentPageIndex = res.pageIndex;
  //        this.totalCount = Math.ceil(res.count / res.pageSize);
  //      },
  //     error: (err) => {
  //        console.log(err);
  //      }}
  //    );
     
  // }

  getAllWorkFlows(){ 
    this.workflowService.getWorkFlowByType(WorkFlowType.contact).subscribe({
      next: (res) => {
         this.workflows = res.payload;
       },
      error: (err) => {
         console.log(err);
       }}
     );
  }


  openAddWorkFlowModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {}
      data.FormTitle = 'Add Contact WorkFlow';
      data.Request_Type = 'Add';
      data.workFlowType = WorkFlowType.contact
      dialogRef = this.dialog.open(AddWorkFlowsComponent, {
        width: '550px',
        height: '80vh',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Edit Contact WorkFlow';
      data.Request_Type = 'Save';
      data.workFlowType = WorkFlowType.contact

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

  searchText = ""
  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
  
}
