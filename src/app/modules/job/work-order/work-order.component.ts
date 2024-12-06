import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from 'src/app/core/services/job.service';
import { AddJobWorkOrderComponent } from '../add-job-work-order/add-job-work-order.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { AppConfig } from 'src/app/core/app-config';
import { Timeline } from 'vis-timeline';
import { WorkorderDetailPageComponent } from '../workorder-detail-page/workorder-detail-page.component';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.css']
})
export class WorkOrderComponent {
  jobId: any;
  WorkOrders: any[] = [];
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  timeline: Timeline;
  options: {};
  data: any[] = [];
  groups: any[] = [];

  @ViewChild('timeline', { static: true }) timelineContainer: ElementRef;
  searchedWorkOrderId: any = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private JobService: JobService,
    private cRef: ChangeDetectorRef
  ) {
    this.jobId = this.route.parent.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      this.searchedWorkOrderId = params['id'];
    });
    // If TimeLine is needed Here Uncomment below Line
    // this.getOptions();
  }

  ngOnInit() {
    this.JobService.subscribeToValue((value) => {
      if (value) {
        this.loadPagedData(this.currentPageIndex);
      }
    })
    this.loadPagedData(this.currentPageIndex);
  }

  loadPagedData(pageNumber: number) {
    this.JobService.GetPaginatedWorkOrderByJobId(this.jobId,pageNumber,this.pageSize).subscribe((res) => {
      this.WorkOrders = res.data;
      this.totalCount = res.count;
      this.currentPageIndex = res.pageIndex??1;
      if (this.searchedWorkOrderId && !isNaN(Number(this.searchedWorkOrderId)) && this.searchedWorkOrderId !== null && this.searchedWorkOrderId !== undefined && this.searchedWorkOrderId !== "" && this.searchedWorkOrderId !== "0") {
        this.previewWorkOrder(this.searchedWorkOrderId);
      }
    });
  }

  initiateTimeline() {
    if (this.timeline) {
      this.timeline.destroy();
      this.groups = [];
      this.data = [];
    }
    this.getTimelineGroups();
    this.getTimelineData();

    // Create a new timeline instance
    this.timeline = new Timeline(this.timelineContainer.nativeElement, null, this.options);
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data);
    this.timeline.redraw();

    this.cRef.detectChanges();
  }

  previewWorkOrder(id: any) {
    debugger
    let dialogRef: any = {};
    let data: any = {};
    data.FormTitle = 'Work Order Details';
    data.Request_Type = 'Add';
    dialogRef = this.dialog.open(WorkorderDetailPageComponent, {
      width: '75vw',
      data: {
        id: id
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.searchedWorkOrderId = 0
      this.router.navigate([`/jobs/${this.jobId}/workorder`])
    });
  }

  openWorkOrderModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = "Add WorkOrder";
      data.Request_Type = "Add";
      dialogRef = this.dialog.open(AddJobWorkOrderComponent, {
        width: '75vw',
        maxWidth: '90vw',
        height: 'auto',
        maxHeight: '90vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.JobService.emitValue(true)
      });
    }
    else {
      data = data;
      data.FormTitle = "Update Workorder";
      data.Request_Type = "Update";
      dialogRef = this.dialog.open(AddJobWorkOrderComponent, {
        width: '75vw',
        maxWidth: '90vw',
        height: 'auto',
        maxHeight: '90vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.JobService.emitValue(true)
      });
    }
  }

  deleteWorkOrder(data: any): void {
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
        this.JobService.deleteWorkOrder(data.id).subscribe({
          next: (res) => {
            this.loadPagedData(this.currentPageIndex);
          },
        });
      }
    });
  }


  getTimelineGroups() {
    this.groups = [
      { id: 'high', content: 'High Priority' },
      { id: 'medium', content: 'Medium Priority' },
      { id: 'low', content: 'Low Priority' }
    ];
  }

  getTimelineData() {

    this.WorkOrders.forEach((order) => {
      var startDate = new Date(order.startDate);
      var endDate = new Date(order.dueDate);
      let backgroundColor = '';
      let borderColor = '';

      switch (order?.workOrderPriority.toLowerCase()) {
        case 'high':
          backgroundColor = '#ff00003d';
          borderColor = '#ff0000';
          this.data.push({
            id: order.id,
            group: 'high', // Assign to High Priority group
            start: startDate,
            end: endDate,
            content: order.name,
            style: 'background-color: ' + backgroundColor + '; border: 1px solid ' + borderColor,
          });
          break;
        case 'medium':
          backgroundColor = '#ffcf0054';
          borderColor = '#e59c00';
          this.data.push({
            id: order.id,
            group: 'medium', // Assign to Medium Priority group
            start: startDate,
            end: endDate,
            content: order.name,
            style: 'background-color: ' + backgroundColor + '; border: 1px solid ' + borderColor,
          });
          break;
        default:
          // If priority is not high or medium, add to Low Priority group
          backgroundColor = '#D5DDF6';
          borderColor = '#7194ff';
          this.data.push({
            id: order.id,
            group: 'low', // Assign to Low Priority group
            start: startDate,
            end: endDate,
            content: order.name,
            style: 'background-color: ' + backgroundColor + '; border: 1px solid ' + borderColor,
          });
          break;
      }
    });
  }

  getOptions() {
    const currentDate = new Date();
    this.options = {
      stack: true,
      start: currentDate.getTime() - 1000 * 60 * 60 * 24 * 10,
      end: currentDate.getTime() + 1000 * 60 * 60 * 24 * 20,
      editable: false,
      margin: {
        item: 50,
        axis: 5
      },
      orientation: 'top',
      showCurrentTime: true,
      zoomMin: 1000 * 60 * 60 * 5,
      zoomMax: 1000 * 60 * 60 * 24 * 30 * 4
    }
  }
}
