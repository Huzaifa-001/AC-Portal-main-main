import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { ContactdetailComponent } from './contactdetail/contactdetail.component';
import { ContactLogbookComponent } from './contact-logbook/contact-logbook.component';
import { ContactFinancialsComponent } from './contact-financials/contact-financials.component';
import { ContactEventsComponent } from './contact-events/contact-events.component';
import { ContactJobsComponent } from './contact-jobs/contact-jobs.component';
import { ContactAttachmentsComponent } from './contact-attachments/contact-attachments.component';
import { ContactPhotosComponent } from './contact-photos/contact-photos.component';
import { ContactTasksComponent } from './contact-tasks/contact-tasks.component';
import { FinanceEstimateComponent } from '../financials/finance-estimate/finance-estimate.component';
import { FinanceBudgetsComponent } from '../financials/finance-budgets/finance-budgets.component';
import { FinanceInvoiceComponent } from '../financials/finance-invoice/finance-invoice.component';
import { FinanceMaterialOrdersComponent } from '../financials/finance-material-orders/finance-material-orders.component';
import { FinanceCreditmemosComponent } from '../financials/finance-creditmemos/finance-creditmemos.component';
import { FinancePaymentsComponent } from '../financials/finance-payments/finance-payments.component';

const routes: Routes = [
  {
    path: '', component: ContactComponent
  },
  {
    path: ':id', component: ContactdetailComponent,
    children: [
      { path: '', component: ContactLogbookComponent },
      { path: 'logbook', component: ContactLogbookComponent },
      {
        path: 'financials',
        component: ContactFinancialsComponent,
        children: [
          { path: '', redirectTo: 'estimates', pathMatch: 'full' }, // Default redirect
          { path: 'estimates', component: FinanceEstimateComponent },
          { path: 'budgets', component: FinanceBudgetsComponent },
          { path: 'invoices', component: FinanceInvoiceComponent },
          { path: 'materialorders', component: FinanceMaterialOrdersComponent },
          { path: 'creditmemos', component: FinanceCreditmemosComponent },
          { path: 'payments', component: FinancePaymentsComponent },
        ]
      },
      { path: 'tasks', component: ContactTasksComponent },
      { path: 'events', component: ContactEventsComponent },
      { path: 'jobs', component: ContactJobsComponent },
      { path: 'attachments', component: ContactAttachmentsComponent },
      { path: 'photos', component: ContactPhotosComponent },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
