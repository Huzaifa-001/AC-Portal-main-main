import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialsComponent } from './financials.component';
import { EstimatesComponent } from './estimates/estimates.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { MaterialOrderComponent } from './material-order/material-order.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { PaymentsComponent } from './payments/payments.component';
import { CreditMemosComponent } from './credit-memos/credit-memos.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialsComponent,
    children: [
      { path: 'estimates', component: EstimatesComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'material-order', component: MaterialOrderComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'credit-memos', component: CreditMemosComponent },
      { path: '', redirectTo: 'estimates', pathMatch: 'full' }, // Default tab
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialsRoutingModule {}
