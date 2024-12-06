import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from 'src/app/core/app-config';
import { AddJobEventComponent } from '../../job/add-job-event/add-job-event.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { JobService } from 'src/app/core/services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventDTO } from '../../job/createEventDto';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-events',
  templateUrl: './contact-events.component.html',
  styleUrls: ['./contact-events.component.css']
})
export class ContactEventsComponent {
  jobId: any;
  events: any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private JobService: JobService,
    private toastr: ToastrService,
    private cRef: ChangeDetectorRef
  ) {
    this.jobId = this.route.parent.snapshot.paramMap.get('id');

  }

  ngOnInit() {
    this.loadPagedData(1);
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  loadPagedData(pageIndex: number) {
    this.JobService.getEventsByJobId(this.jobId).subscribe((res) => {
      this.events = []
      this.events = res.data
      // this.totalCount = Math.ceil(res.count / res.pageSize) ?? res.length;
      this.totalCount =  0 //res.length;
      this.currentPageIndex = res.pageIndex ?? 1;
      this.cRef.detectChanges()
    });
  }


  editEvent(data: any): void {
    let dialogRef: any = {};
    data.FormTitle = "Update Event";
    data.Request_Type = "Update";
    dialogRef = this.dialog.open(AddJobEventComponent, {
      width: '50vw',
      height: '70vh',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadPagedData(this.currentPageIndex)
    });
  }

  deleteEvent(data: any): void {
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
        const event:EventDTO = {
          id: data.id,
          eventType: data.eventType,
          eventPriority: data.eventPriority,
          eventName: data.eventName,
          eventStatus: data.eventStatus,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          estimatedDuration: data.estimatedDuration,
          description: data.description,
          tags: data.tags,
          lastStatusChangeDate: new Date(data.lastStatusChangeDate).toISOString(),
          jobId: data.jobId
        };
        this.JobService.deleteEvent(event).subscribe({
          next: (res) => {
            this.toastr.success(res.message, 'Success');
          },
          error: (err) => {
            this.toastr.error(err.message, 'Error');
          }, complete: () => {
            this.loadPagedData(this.currentPageIndex);
          }
        });
      }
    });
  }
}
