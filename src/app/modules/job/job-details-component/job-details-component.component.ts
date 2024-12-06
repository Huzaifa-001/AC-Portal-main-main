import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddJobWorkOrderComponent } from '../add-job-work-order/add-job-work-order.component';
import { AddJobEventComponent } from '../add-job-event/add-job-event.component';
import { AddWorkflowComponent } from '../add-workflow/add-workflow.component';
import { JobService } from 'src/app/core/services/job.service';
import { AddJobsComponent } from '../add-jobs/add-jobs.component';
import { Timeline } from 'vis-timeline';
import { ContactService } from 'src/app/core/services/contact.service';
import { Subscription } from 'rxjs';
import { FieldService } from 'src/app/core/services/field.service';
import { EntityTypes } from '../../custom-fields/common';

@Component({
  selector: 'app-job-details-component',
  templateUrl: './job-details-component.component.html',
  styleUrls: ['./job-details-component.component.css']
})
export class JobDetailsComponentComponent implements OnDestroy {
  private subscriptions: Subscription = new Subscription();

  job: any;
  jobId: string;
  timeline: Timeline;
  options: {};
  data: any[] = [];
  groups: any[] = [];
  salesReps: any;
  subcontractors: any;
  PrimaryContacts: any;
  RelatedContacts: any;
  TeamMembers: any;
  JobData: any = {};

  @ViewChild('timeline', { static: true }) timelineContainer: ElementRef;
  WorkOrders: any;

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog, private router: Router,
    private jobsService: JobService,
    private contactService: ContactService, private cRef: ChangeDetectorRef) {
    this.getOptions();
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');
      jobsService.getJobByID(Number(this.jobId)).subscribe({
        next: (res) => {
          this.job = res
          this.getSalesRep()
          this.getSubcontractors()
          this.getAllcontacts()
          this.getRelatedcontacts()
          this.getTeamMembers()
        },
        error: (err) => {
          this.job = history.state.model;
        }
      })
    });
  }

  ngOnInit() {
    this.loadTimeLineData();
    this.jobsService.subscribeToValue((value) => {
      if (value) {
        this.loadTimeLineData();
      }
    })
  }

  // Helper function to get a name by ID from an array
  getNameById(id: number, sourceArray: any[]): string {
    const matchingItem = sourceArray.find(item => item.id === id);
    return matchingItem ? matchingItem.name : '';
  }

  // Helper function to get names by IDs from an array
  getNamesByIds(ids: number[], sourceArray: any[]): { id: number; name: string }[] {
    return ids.map(id => ({
      id: id,
      name: this.getNameById(id, sourceArray)
    }));
  }

  getSalesRep() {
    this.subscriptions.add(
      this.jobsService.allSalesRep().subscribe({
        next: (res) => {
          this.salesReps = res.payload;
          this.JobData.SalesRep = {
            id: this.job.salesRepsentativeId,
            name: this.getNameById(this.job.salesRepsentativeId, this.salesReps)
          }
          console.log(this.JobData)

        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getRelatedcontacts() {
    this.subscriptions.add(
      this.jobsService.allRelatedContacts().subscribe({
        next: (res) => {
          this.RelatedContacts = res.payload;
          this.JobData.
            RelatedContacts = this.getNamesByIds(this.job.relatedContactId, this.RelatedContacts)
          console.log(this.JobData)

        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getSubcontractors() {
    this.subscriptions.add(
      this.jobsService.allSubcontractors().subscribe({
        next: (res) => {
          this.subcontractors = res.payload;
          this.JobData.Subcontractor = {
            id: this.job.subContractorId,
            name: this.getNameById(this.job.subContractorId, this.subcontractors)
          }
          console.log(this.JobData)
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getAllcontacts() {
    this.subscriptions.add(
      this.contactService.allResult().subscribe({
        next: (res) => {
          console.log("Contacts: ", res.payload);
          this.PrimaryContacts = res.payload.map(contact => ({
            id: contact.id,
            name: contact.firstName + ' ' + contact.lastName
          }));

          this.JobData.PrimaryContact = {
            id: this.job.primaryContactId,
            name: this.getNameById(this.job.primaryContactId, this.PrimaryContacts)
          }
          console.log(this.JobData)
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  getTeamMembers() {
    this.subscriptions.add(
      this.jobsService.allTeamMembers().subscribe({
        next: (res) => {
          this.TeamMembers = res.payload;
          this.JobData.
            TeamMembers = this.getNamesByIds(this.job.teamMememberId, this.TeamMembers)
          console.log("TeamMembers: ", this.JobData.TeamMembers)

        },
        error: (err) => {
          console.log(err);
        },
      })
    );
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
      this.jobsService.getJobByID(Number(this.jobId)).subscribe(res => {
        this.job = res;
      },
        err => {
          this.job = history.state.model;
        })
    });
  }

  openWorkflowModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = "Add Workflow";
      data.Request_Type = "Add";
      dialogRef = this.dialog.open(AddWorkflowComponent, {
        width: '40vw',
        height: '50vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
      });
    }
    else {
      data = data[0];
      data.FormTitle = "Update Workflow";
      data.Request_Type = "Update";
      dialogRef = this.dialog.open(AddWorkflowComponent, {
        width: '40vw',
        height: '50vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
      });
    }
  }

  openEventModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = "Add Event";
      data.Request_Type = "Add";
      dialogRef = this.dialog.open(AddJobEventComponent, {
        width: '50vw',
        height: '70vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
      });
    }
    else {
      data = data[0];
      data.FormTitle = "Update Event";
      data.Request_Type = "Update";
      dialogRef = this.dialog.open(AddJobEventComponent, {
        width: '50vw',
        height: '70vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
      });
    }
  }

  openWorkOrderModal(data: any): void {
    debugger
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = "Add WorkOrder";
      data.Request_Type = "Add";
      data.workFlowId = this.job.workFlowId;
      data.jobId = this.job.id
      dialogRef = this.dialog.open(AddJobWorkOrderComponent, {
        width: '75vw',
        maxWidth: '90vw',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.jobsService.emitValue(true);
        }
      });
    }
    else {
      data = data[0];
      data.FormTitle = "Update Workorder";
      data.Request_Type = "Update";
      data.workFlowId = this.job.workFlowId;
      dialogRef = this.dialog.open(AddJobWorkOrderComponent, {
        width: '75vw',
        maxWidth: '90vw',
        height: 'auto',
        maxHeight: '90vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.jobsService.emitValue(true);
        }
      });
    }
  }

  redirectTO(route) {
    const fullRoute = `/jobs/${this.job.id}/`;
    const childRoute = route; // Child route path
    this.router.navigate([fullRoute, childRoute], { state: { data: this.job } });
  }

  loadTimeLineData() {
    debugger
    this.jobsService.GetWorkOrderByJobId(this.jobId).subscribe((res) => {
      this.WorkOrders = res.data;
      if (this.timeline) {
        this.timeline.destroy();
        this.groups = [];
        this.data = [];
      }
      this.getTimelineGroups();
      this.getTimelineData();
      this.timeline = new Timeline(this.timelineContainer.nativeElement, null, this.options);
      this.timeline.setGroups(this.groups);
      this.timeline.setItems(this.data);
      this.timeline.redraw();
      this.cRef.detectChanges();
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.JobData = {}
  }
}
