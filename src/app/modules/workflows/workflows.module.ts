import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkFlowsComponent } from './work-flows/work-flows.component';
import { WorkflowsRoutingModule } from './workflows-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { TagInputModule } from 'ngx-chips';
import { ContactTabComponent } from './contact-tab/contact-tab.component';
import { JobsTabComponent } from './jobs-tab/jobs-tab.component';
import { WorkOrdersTabComponent } from './work-orders-tab/work-orders-tab.component';
import { GlobalStatusTabComponent } from './global-status-tab/global-status-tab.component';
import { CoreModule } from 'src/app/core/core.module';
import { AddWorkFlowsComponent } from './add-work-flow/add-work-flow.component';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    WorkFlowsComponent,
    ContactTabComponent,
    JobsTabComponent,
    WorkOrdersTabComponent,
    GlobalStatusTabComponent,
    AddWorkFlowsComponent
  ],
  imports: [
    WorkflowsRoutingModule,
    ReactiveFormsModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
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
    MatTabsModule
  ]
})
export class WorkflowsModule { }
