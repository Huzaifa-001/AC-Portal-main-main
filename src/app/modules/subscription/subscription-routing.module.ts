import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: SubscriptionPlansComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
