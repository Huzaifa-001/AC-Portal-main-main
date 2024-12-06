import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { DTOProject, JobDTO } from 'src/app/core/interfaces';
import { Subscription, forkJoin } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { AddProjectComponent } from '../add-project/add-project.component';
import { ProjectService } from 'src/app/core/services/project.service';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  @ViewChild('myTable') table!: HTMLTableElement;

  statuses: any[] = [];
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
  projects: DTOProject[] = [];
  relatedcontacts: any;

  constructor(
    private router: Router,
    private jobService: JobService,
    private dialog: MatDialog,
    private csvExportService: CsvExportService,
    private contactService: ContactService,
    private projService: ProjectService,
  ) {}

  ngOnInit() {
    this.getRelatedcontacts()
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
      this.projService.getAllProjects(dto).subscribe({
        next: (res: any) => {

          this.totalCount = Math.ceil(res.count / res.pageSize)??0;
          this.currentPageIndex = res.pageIndex??1;

          const primaryContactMap = new Map<number, string>();
          this.relatedcontacts.forEach((contact) => {
            primaryContactMap.set(contact.id, contact.name);
          });

          this.projects = res.data
          this.projects.forEach((x) => {
            x.accessUserName = primaryContactMap.get(x.accessUserID) || '';
          });


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

  openAddProjectModal(data: any = null): void {
    debugger
    if (data == null) {
      data = {
        FormTitle: 'Add Project',
        Request_Type: 'Add',
      };
    } else {
      data.FormTitle = 'Edit Project';
      data.Request_Type = 'Save';
    }

    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '54vw',
      height: '80vh',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPagedData(this.currentPageIndex)
    });
  }

  redirect(jobs: any) {
    return
    this.router.navigate(['/jobs', jobs.id], { state: { model: jobs } });
  }

  deleteProjectClick(data: any): void {
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
      debugger
      if (result) {
        const proj: DTOProject = {
          projectName: data.projectName,
          projectType: data.projectType,
          projectColor: data.projectColor,
          background: data.background,
          accessUserID: data.accessUserID
        }
        this.projService.deleteProject(proj).subscribe({
          next: (res) => {
            console.log(res);
          },
        });
      }
    });
  }


  getRelatedcontacts() {
    this.subscriptions.add(
      this.contactService.getRelatedContactsDropDown().subscribe({
        next: (res) => {
          this.relatedcontacts = res.payload;
          this.loadPagedData(this.currentPageIndex)
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  searchText = ""
  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
