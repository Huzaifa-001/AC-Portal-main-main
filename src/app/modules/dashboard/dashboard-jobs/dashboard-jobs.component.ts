import { Component } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { WorkFlowType } from 'src/app/core/interfaces';
import { ContactService } from 'src/app/core/services/contact.service';
import { JobService } from 'src/app/core/services/job.service';
import { WorkflowService } from 'src/app/core/workflow.service';
import { AddJobsComponent } from '../../job/add-jobs/add-jobs.component';
import { AppConfig } from 'src/app/core/app-config';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-jobs',
  templateUrl: './dashboard-jobs.component.html',
  styleUrls: ['./dashboard-jobs.component.css']
})
export class DashboardJobsComponent {
  statuses: any[] = [];
  jobWorkflows: any[] = [];
  salesReps: any[] = [];
  JobSortField = '';
  JobSortOrder: 'asc' | 'desc' = 'asc';
  allContacts: any;
  pageSize: number = AppConfig.dashBoardPageSize;
  subscriptions: Subscription = new Subscription();
  Jobs: any[] = [];
  currentJobPageIndex: any = 1;
  JobsTotalCount: number = 0;

  constructor(private dialog: MatDialog,
    private router: Router,
    private jobService: JobService,
    private contactService: ContactService,
    private workFlowService: WorkflowService) { }

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
        this.loadJobsPagedData(this.currentJobPageIndex);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getWorkFlowByType() {
    this.subscriptions.add(
      this.workFlowService.getWorkFlowByType(WorkFlowType.jobs).subscribe({
        next: (res) => {
          this.jobWorkflows = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  onJobsSort(field: string) {
    this.JobSortField = field;
    this.JobSortOrder = this.JobSortOrder === 'asc' ? 'desc' : 'asc';
  }

  JobRedirect(jobs: any) {
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
      this.loadJobsPagedData(this.currentJobPageIndex);
    });
  }

  loadJobsPagedData(pageIndex: number) {
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

          this.JobsTotalCount = Math.ceil(res.count / res.pageSize) ?? 0;
          this.currentJobPageIndex = res.pageIndex ?? 1;
          const statusesMap = new Map<number, string>();
          const workflowsMap = new Map<number, string>();
          this.statuses.forEach((status) => {
            statusesMap.set(status.id, status.statusName);
          });

          this.jobWorkflows.forEach((flow) => {
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

}