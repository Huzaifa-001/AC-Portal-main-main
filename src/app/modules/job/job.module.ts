import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsComponent } from './jobs/jobs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Import this if you want to use the input component within MatFormField
import { MatSelectModule } from '@angular/material/select';
import { AddJobsComponent } from './add-jobs/add-jobs.component';
import { JobRoutingModule } from './job-routing.module';
import {
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { TagInputModule } from 'ngx-chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddWorkflowComponent } from './add-workflow/add-workflow.component';
import { AddJobEventComponent } from './add-job-event/add-job-event.component';
import { AddJobWorkOrderComponent } from './add-job-work-order/add-job-work-order.component';
import { JobDetailsComponentComponent } from './job-details-component/job-details-component.component';
import { CoreModule } from 'src/app/core/core.module';
import { JobsLogbookComponent } from './jobs-logbook/jobs-logbook.component';
import { EventsComponent } from './events/events.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow/workflow.component';
import { NotesModalComponent } from './notes-modal/notes-modal.component';
import { AttachementsComponent } from './attachements/attachements.component';
import { PhotosComponent } from './photos/photos.component';
import { AddJobPhotoComponent } from './add-job-photo/add-job-photo.component';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { WorkorderDetailPageComponent } from './workorder-detail-page/workorder-detail-page.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JobsTasksComponent } from './jobs-tasks/jobs-tasks.component';
import { FinancialsComponent } from './../financials/financials.component';

@NgModule({
  declarations: [
    JobsComponent,
    AddJobsComponent,
    AddWorkflowComponent,
    AddJobEventComponent,
    AddJobWorkOrderComponent,
    JobDetailsComponentComponent,
    JobsLogbookComponent,
    EventsComponent,
    WorkOrderComponent,
    WorkflowComponent,
    NotesModalComponent,
    AttachementsComponent,
    PhotosComponent,
    AddJobPhotoComponent,
    WorkorderDetailPageComponent,
    JobsTasksComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    JobRoutingModule,
    AccordionModule,
    PanelModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CommonModule,
    TagInputModule,
    CoreModule,
    RouterModule,
    FormsModule,
  ],
  exports: [EventsComponent, JobsComponent, AddJobEventComponent],
})
export class JobModule {}
