import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { AddJobsComponent } from '../add-jobs/add-jobs.component';
import { JobDTO, WorkFlowType } from 'src/app/core/interfaces';
import { Subscription, forkJoin } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { AppConfig } from 'src/app/core/app-config';
import { WorkflowService } from 'src/app/core/workflow.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent {
  @ViewChild('myTable') table!: HTMLTableElement;

  statuses: any[] = [];
  workflows: any[] = [];
  // salesRepsentativeId
  // primaryContactId
  subscriptions: Subscription = new Subscription();

  Jobs: JobDTO[] = [];
  phoneNumbers: {
    id: string;
    phoneNumber: string;
    typeId: string;
    typeName: string;
  }[] = [];
  salesReps: any[] = [];
  allContacts: any;

  constructor(
    private router: Router,
    private jobService: JobService,
    private dialog: MatDialog,
    private csvExportService: CsvExportService,
    private contactService: ContactService,
    private workFlowService: WorkflowService,
  ) { }

  ngOnInit() {
    this.getWorkFlowByType();
    const salesRepObservable = this.jobService.allSalesRep();
    const statusesObservable = this.jobService.allStatus();
    const contactsObservable = this.contactService.allResult();
    forkJoin([salesRepObservable, statusesObservable, contactsObservable]).subscribe({
      next: (results) => {
        const salesRepRes = results[0];
        const statusesRes = results[1];
        const contactsRes = results[2];
        this.salesReps = salesRepRes.payload;
        this.statuses = statusesRes.payload;
        this.allContacts = contactsRes.payload;
        this.allContacts.forEach(element => {
          element.name = element.firstName + ' ' + element.lastName
        });

        // Now call getAllJobs()
        this.loadPagedData(this.currentPageIndex);

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  loadPagedData(pageIndex: number) {
    const dto = {
      PageNumber: pageIndex,
      pageSize: this.pageSize,
    };

    this.subscriptions.add(
      this.jobService.getAllJobsWithPagination(dto).subscribe({
        next: (res: any) => {
          console.log(res);
          this.Jobs = [];
          this.Jobs = res.data;
          this.totalCount = res.count;
          this.currentPageIndex = res.pageIndex??1;
          const statusesMap = new Map<number, string>();
          const workflowsMap = new Map<number, string>();
          this.statuses.forEach((status) => {
            statusesMap.set(status.id, status.statusName);
          });

          this.workflows.forEach((flow) => {
            workflowsMap.set(flow.id, flow.workFlowName);
          });

          const salesRepsMap = new Map<number, string>();
          this.salesReps.forEach((salesRep) => {
            salesRepsMap.set(salesRep.id, salesRep.name);
          });

          const primaryContactMap = new Map<number, string>();
          this.allContacts.forEach((contact) => {
            primaryContactMap.set(contact.id, contact.name);
          });

          this.Jobs.forEach((x) => {
            x.jobStatus = statusesMap.get(x.jobStatusId) || '';
            x.workFlow = workflowsMap.get(x.workFlowId) || '';
            x.salesRepName = salesRepsMap.get(x.salesRepsentativeId) || '';
            x.primaryContactName = primaryContactMap.get(x.primaryContactId) || '';
          });
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
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

  getStatuses() {
    this.subscriptions.add(
      this.jobService.allStatus().subscribe({
        next: (res) => {
          this.statuses = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getWorkFlowByType() {
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

  exportTable() {
    this.csvExportService.exportTableToCsv(this.table, 'exported-data.csv');
  }

  openAddJobsModal(data: any): void {
    if (data == null) {
      data = {
        FormTitle: 'Add Job',
        Request_Type: 'Add',
      };
    } else {
      data.FormTitle = 'Edit Job';
      data.Request_Type = 'Save';
    }

    const dialogRef = this.dialog.open(AddJobsComponent, {
      width: '80vw',
      height: '80vh',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPagedData(this.currentPageIndex);
    });
  }

  redirect(jobs: any) {
    this.router.navigate(['/jobs', jobs.id], { state: { model: jobs } });
  }

  deleteJobClick(data: any): void {
    let dialogRef: any = {};
    data.FormTitle = 'Confirm Delete';
    data.Request_Type = 'Delete';
    dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.jobService.deleteJob(data).subscribe({
          next: (res) => {
            console.log(res);
          },
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  searchText = ""
  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
