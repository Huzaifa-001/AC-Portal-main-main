import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { ChartModule } from 'primeng/chart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateReportComponent } from './create-report/create-report.component';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TagInputModule } from 'ngx-chips';
import { JobRoutingModule } from '../job/job-routing.module';

@NgModule({
  declarations: [
    AnalyticsComponent,
    AnalyticsDashboardComponent,
    ReportsComponent,
    CreateReportComponent,
  ],
  imports: [
    CommonModule,
    CanvasJSAngularChartsModule,
    MatTabsModule,
    FormsModule,
    ChartModule,
    MatDialogModule,
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
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }
