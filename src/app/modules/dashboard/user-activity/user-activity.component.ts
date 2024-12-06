import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/core/app-config';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { JobService } from 'src/app/core/services/job.service';
import { TasksService } from 'src/app/core/services/tasks.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent {
  @ViewChild('myTable') table!: HTMLTableElement;

  statuses: any[] = [];
  workflows: any[] = [];
  // salesRepsentativeId
  // primaryContactId
  subscriptions: Subscription = new Subscription();

  userActivities: any[] = [];
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
    private csvExportService: CsvExportService,
  ) { }

  ngOnInit() {
this.jobService.getUserActivityLogs().subscribe({
      next: (results) => {
        this.userActivities = results.data
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;


  exportTable() {
    this.csvExportService.exportTableToCsvIncludingLastCol(this.table, 'User-Activity.csv');
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
