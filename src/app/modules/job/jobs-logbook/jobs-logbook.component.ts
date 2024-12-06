import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-jobs-logbook',
  templateUrl: './jobs-logbook.component.html',
  styleUrls: ['./jobs-logbook.component.css']
})
export class JobsLogbookComponent {
  jobId: any;
  logBooks: any[] = [];

  constructor(private route: ActivatedRoute, private dialog: MatDialog,private JobService: JobService) {
    this.jobId = this.route.parent.snapshot.paramMap.get('id');
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  ngOnInit() {
    this.loadPagedData(this.currentPageIndex);
  }

  loadPagedData(pageIndex: number) {
    this.JobService.getLogsByJobId(this.jobId).subscribe((res) => {
      this.logBooks = []
      this.logBooks =  res.data
      // this.totalCount = this.logBooks.length;
      this.currentPageIndex = res?.pageIndex ?? 1;
    });
  }
}
