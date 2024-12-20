import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';
import { JobDetailsComponentComponent } from './job-details-component/job-details-component.component';
import { JobsLogbookComponent } from './jobs-logbook/jobs-logbook.component';
import { EventsComponent } from './events/events.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { AttachementsComponent } from './attachements/attachements.component';
import { PhotosComponent } from './photos/photos.component';
import { JobsTasksComponent } from './jobs-tasks/jobs-tasks.component';
import { FinancialsComponent } from '../financials/financials.component';

const routes: Routes = [
  { path: '', component: JobsComponent },
  {
    path: ':id',
    component: JobDetailsComponentComponent,
    children: [
      { path: '', redirectTo: 'logbook', pathMatch: 'full' },
      { path: 'logbook', component: JobsLogbookComponent },
      {
        path: 'financials',
        loadChildren: () =>
          import('../financials/financials.module').then(
            (m) => m.FinancialsModule
          ),
      },
      { path: 'events', component: EventsComponent },
      { path: 'workorder', component: WorkOrderComponent },
      { path: 'workflows', component: WorkflowComponent },
      { path: 'attachments', component: AttachementsComponent },
      { path: 'photos', component: PhotosComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class JobRoutingModule {}
