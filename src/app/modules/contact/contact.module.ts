import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact/contact.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TagInputModule } from 'ngx-chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddcontactComponent } from './addcontact/addcontact.component';
import { ContactdetailComponent } from './contactdetail/contactdetail.component';
import { RelatedContactDetailsComponent } from './related-contact-details/related-contact-details.component';
import { CoreModule } from 'src/app/core/core.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchPipe } from 'src/app/core/search.pipe';
import { ContactLogbookComponent } from './contact-logbook/contact-logbook.component';
import { ContactJobsComponent } from './contact-jobs/contact-jobs.component';
import { ContactEventsComponent } from './contact-events/contact-events.component';
import { ContactAttachmentsComponent } from './contact-attachments/contact-attachments.component';
import { ContactPhotosComponent } from './contact-photos/contact-photos.component';
import { ContactFinancialsComponent } from './contact-financials/contact-financials.component';
import { ContactFormsComponent } from './contact-forms/contact-forms.component';
import { AddContactPhotoComponent } from './add-contact-photo/add-contact-photo.component';
import { ContactTasksComponent } from './contact-tasks/contact-tasks.component';


@NgModule({
  declarations: [
    ContactComponent,
    AddcontactComponent,
    ContactdetailComponent,
    RelatedContactDetailsComponent,
    ContactLogbookComponent,
    ContactJobsComponent,
    ContactEventsComponent,
    ContactAttachmentsComponent,
    ContactPhotosComponent,
    ContactFinancialsComponent,
    ContactFormsComponent,
    AddContactPhotoComponent,
    ContactTasksComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatIconModule,
    TagInputModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    CoreModule,
    FormsModule
  ],
  exports:[ContactComponent]
})
export class ContactModule { }
