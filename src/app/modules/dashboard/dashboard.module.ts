import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskCreationDialogComponent } from './task-creation-dialog/task-creation-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { EventsComponent } from '../job/events/events.component';
import { JobsComponent } from '../job/jobs/jobs.component';
import { JobModule } from '../job/job.module';
import { ContactModule } from '../contact/contact.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CoreModule } from '../../core/core.module';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { DashboardJobsComponent } from './dashboard-jobs/dashboard-jobs.component';
import { DashboardTasksComponent } from './dashboard-tasks/dashboard-tasks.component';
import { DashboardContactsComponent } from './dashboard-contacts/dashboard-contacts.component';
import { DashboardEstimatesComponent } from './dashboard-estimates/dashboard-estimates.component';
import { DashboardAnalyticsCardsComponent } from './dashboard-analytics-cards/dashboard-analytics-cards.component';
import { OrganizeDashboardComponent } from './organize-dashboard/organize-dashboard.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DashboardLogbookComponent } from './dashboard-logbook/dashboard-logbook.component';
import { AllNotificationsComponent } from './all-notifications/all-notifications.component';

@NgModule({
  declarations: [
    DashboardComponent,
    TaskCreationDialogComponent,
    UserActivityComponent,
    DashboardJobsComponent,
    DashboardTasksComponent,
    DashboardContactsComponent,
    DashboardEstimatesComponent,
    DashboardAnalyticsCardsComponent,
    OrganizeDashboardComponent,
    DashboardLogbookComponent,
    AllNotificationsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatButtonModule,
    TagInputModule,
    MatDialogModule,
    JobModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    MatMenuModule,
    MatSnackBarModule,
    ContactModule,
    CoreModule,
    FormsModule,
  ],
})
export class DashboardModule {}
