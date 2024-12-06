import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { AppConfig } from 'src/app/core/app-config';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { WorkflowService } from 'src/app/core/workflow.service';
import { AddEmailTemplateComponent } from '../add-email-template/add-email-template.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.css']
})
export class EmailTemplatesComponent {
  @ViewChild('contactWorkflowTable') table!: HTMLTableElement;

  emailTemplates: any[] = [];
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  constructor(
    private templateService: AutomationAndTemplateService,
    private toastr: ToastrService,

    private dialog: MatDialog,
  ) { }
  ngOnInit() {
    this.getAllemailTemplates()
  }

  getAllemailTemplates() {
    this.templateService.getAllEmailTemplates().subscribe({
      next: (res) => {
        this.emailTemplates = res.data;
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    }
    );
  }

  deleteEmail(contact: any) {
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
        this.templateService.deleteEmailTemplate(contact.id).subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success(res.message);

            this.getAllemailTemplates()
          },
          error: (res) => {
            this.toastr.error(res.message);
          },
        });
      }
    });
  }

  openAddEmailModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Add Email Template';
      data.Request_Type = 'Add';
      data.isUpdate = false;
      dialogRef = this.dialog.open(AddEmailTemplateComponent, {
        width: '70vw',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Edit Email Template';
      data.Request_Type = 'Save';
      data.isUpdate = true;
      dialogRef = this.dialog.open(AddEmailTemplateComponent, {
        width: '70vw',
        data: data,
        disableClose: true,
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result == true){
        this.getAllemailTemplates()
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
