import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css']
})
export class FinancialsComponent {
  jobId: any;
  events: any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private JobService: JobService,
    private cRef: ChangeDetectorRef
  ) {
    this.route.paramMap.subscribe((params) => {
      this.jobId = history.state.data;
      console.log(this.jobId);
    });
  }


  ngOnInit() {
    this.loadPagedData(this.currentPageIndex);
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  loadPagedData(pageIndex: number) {
    this.JobService.getAllEvents().subscribe((res) => {
      this.events = []
      this.events = res
      // this.totalCount = Math.ceil(res.count / res.pageSize) ?? res.length;
      this.totalCount = res.length;
      this.currentPageIndex = res.pageIndex ?? 1;
      this.cRef.detectChanges()
    });
  }
}
