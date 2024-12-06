import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { AllNotificationsComponent } from './all-notifications/all-notifications.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'user-activity',
    component: UserActivityComponent
  },
  {
    path: 'notifications',
    component: AllNotificationsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
