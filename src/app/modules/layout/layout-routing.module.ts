import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuradService } from 'src/app/core/rootservices/AuthGuradService';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('src/app/modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('src/app/modules/contact/contact.module').then(
            (m) => m.ContactModule
          ),
      },
      {
        path: 'jobs',
        loadChildren: () =>
          import('src/app/modules/job/job.module').then((m) => m.JobModule),
      },
      {
        path: 'boards',
        loadChildren: () =>
          import('src/app/modules/projects/projects.module').then((m) => m.ProjectsModule),
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('src/app/modules/analytics/analytics.module').then((m) => m.AnalyticsModule),
      }, {
        path: 'calendar',
        loadChildren: () =>
          import('src/app/modules/calendar/calendar.module').then((m) => m.CalendarModule),
      },
      {
        path: 'help-and-support',
        loadChildren: () =>
          import('src/app/modules/help-and-support/help-and-support.module').then((m) => m.HelpAndSupportModule),
      },
      {
        path: 'settings',
        children: [
          { path: '', redirectTo: 'location', pathMatch: 'full' },
          {
            path: 'location',
            loadChildren: () =>
              import('src/app/modules/location/location.module').then(
                (m) => m.LocationModule
              ),
          },
          {
            path: 'workflows',
            loadChildren: () =>
              import('src/app/modules/workflows/workflows.module').then(
                (m) => m.WorkflowsModule
              ),
          },
          {
            path: 'custom-fields',
            loadChildren: () =>
              import('src/app/modules/custom-fields/custom-fields.module').then(
                (m) => m.CustomFieldsModule
              ),
          },
          {
            path: 'automation',
            loadChildren: () =>
              import('src/app/modules/automations/automations.module').then(
                (m) => m.AutomationsModule
              ),
          },
          {
            path: 'templates',
            loadChildren: () =>
              import('src/app/modules/templates/templates.module').then(
                (m) => m.TemplatesModule
              ),
          },
          {
            path: 'team-members',
            loadChildren: () =>
              import('src/app/modules/team-members/team-members.module').then(
                (m) => m.TeamMembersModule
              ),
          },
        ],
      },
    ],
    
    canActivate: [AuthGuradService],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'subscriptions',
    loadChildren: () =>
      import('src/app/modules/subscription/subscription.module').then((m) => m.SubscriptionModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule { }
