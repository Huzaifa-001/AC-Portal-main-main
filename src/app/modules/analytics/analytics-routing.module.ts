import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CreateReportComponent } from './create-report/create-report.component';

const routes: Routes = [
  {
    path:'', component:AnalyticsComponent
  },
  {
    path:'add-report', component: CreateReportComponent
  },
  // {
  //   path:':id', component:ContactdetailComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
