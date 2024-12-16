import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialsRoutingModule } from './financials-routing.module';
import { FinancialsComponent } from './financials.component';
import { EstimatesComponent } from './estimates/estimates.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { MaterialOrderComponent } from './material-order/material-order.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { CreditMemosComponent } from './credit-memos/credit-memos.component';
import { PaymentsComponent } from './payments/payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreModule } from '@angular/flex-layout';
import { TagInputModule } from 'ngx-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ContactRoutingModule } from '../contact/contact-routing.module';
import { AddEstimateComponent } from './estimates/add-estimate/add-estimate.component';
import { RouterModule } from '@angular/router';
import { EditEstimateComponent } from './estimates/edit-estimate/edit-estimate.component';
import { EstimateDetailComponent } from './estimates/estimate-detail/estimate-detail.component';

@NgModule({
  declarations: [
    FinancialsComponent,
    EstimatesComponent,
    BudgetsComponent,
    MaterialOrderComponent,
    InvoicesComponent,
    CreditMemosComponent,
    PaymentsComponent,
    AddEstimateComponent,
    EditEstimateComponent,
    EstimateDetailComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FinancialsRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    ContactRoutingModule,
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
    FormsModule,
  ],
})
export class FinancialsModule {}
