import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { ContactdetailComponent } from './contactdetail/contactdetail.component';
import { ContactLogbookComponent } from './contact-logbook/contact-logbook.component';
import { ContactEventsComponent } from './contact-events/contact-events.component';
import { ContactJobsComponent } from './contact-jobs/contact-jobs.component';
import { ContactAttachmentsComponent } from './contact-attachments/contact-attachments.component';
import { ContactPhotosComponent } from './contact-photos/contact-photos.component';
import { ContactTasksComponent } from './contact-tasks/contact-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: ContactComponent,
  },
  {
    path: ':id',
    component: ContactdetailComponent,
    children: [
      { path: '', component: ContactLogbookComponent },
      { path: 'logbook', component: ContactLogbookComponent },
      {
        path: 'financials',
        loadChildren: () =>
          import('../financials/financials.module').then(
            (m) => m.FinancialsModule
          ),
      },
      { path: 'tasks', component: ContactTasksComponent },
      { path: 'events', component: ContactEventsComponent },
      { path: 'jobs', component: ContactJobsComponent },
      { path: 'attachments', component: ContactAttachmentsComponent },
      { path: 'photos', component: ContactPhotosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
