import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent {
  jobId: any;
  workFlows: any[] = [];

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
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  ngOnInit() {
    this.loadPagedData(1);
  }

  loadPagedData(pageIndex: number) {
    this.JobService.getAllWorkFlows().subscribe((res) => {
      this.workFlows = []
      this.workFlows =  res //res.filter(x => x.jobId == this.jobId)
      // this.totalCount = Math.ceil(res.count / res.pageSize)??0;
      this.totalCount = this.workFlows.length;
      this.currentPageIndex = res?.pageIndex ?? 1;
    });
  }
}
