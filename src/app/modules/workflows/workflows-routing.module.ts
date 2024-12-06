import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkFlowsComponent } from './work-flows/work-flows.component';
import { ContactTabComponent } from './contact-tab/contact-tab.component';
import { JobsTabComponent } from './jobs-tab/jobs-tab.component';
import { WorkOrdersTabComponent } from './work-orders-tab/work-orders-tab.component';
import { GlobalStatusTabComponent } from './global-status-tab/global-status-tab.component';

const routes: Routes = [
  {
    path: '',
    component: WorkFlowsComponent,
    children: [
      { path: 'contacts', component: ContactTabComponent },
      { path: 'jobs', component: JobsTabComponent },
      { path: 'work-orders', component: WorkOrdersTabComponent },
      { path: 'global-status', component: GlobalStatusTabComponent },
      { path: '', redirectTo: 'contacts', pathMatch: 'full' } // Default to 'contacts' tab
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule {}
