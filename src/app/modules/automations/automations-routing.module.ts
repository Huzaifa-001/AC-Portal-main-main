import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AutomationsListComponent } from './automations-list/automations-list.component';

const routes: Routes = [
  {
    path: '',
    component: AutomationsListComponent,
    children: [
      { path: '', component: AutomationsListComponent },
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationsRoutingModule {}
