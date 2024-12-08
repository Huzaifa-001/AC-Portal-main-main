import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialsRoutingModule } from './financials-routing.module';
import { FinanceEstimateComponent } from './finance-estimate/finance-estimate.component';
import { FinanceBudgetsComponent } from './finance-budgets/finance-budgets.component';
import { FinanceInvoiceComponent } from './finance-invoice/finance-invoice.component';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Import this
import { RouterModule } from '@angular/router';
import { CoreModule } from '@angular/flex-layout';
import { TagInputModule } from 'ngx-chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AddFinanceEstimateComponent } from './add-finance-estimate/add-finance-estimate.component';
import { AddFinanceBudgetComponent } from './add-finance-budget/add-finance-budget.component';
import { AddFinanceInvoiceComponent } from './add-finance-invoice/add-finance-invoice.component';
import { FinanceMaterialOrdersComponent } from './finance-material-orders/finance-material-orders.component';
import { AddFinanceMaterialOrdersComponent } from './add-finance-material-orders/add-finance-material-orders.component';

@NgModule({
  declarations: [
    FinanceEstimateComponent,
    FinanceBudgetsComponent,
    FinanceInvoiceComponent,
    AddFinanceEstimateComponent,
    AddFinanceBudgetComponent,
    AddFinanceInvoiceComponent,
    FinanceMaterialOrdersComponent,
    AddFinanceMaterialOrdersComponent,
  ],
  imports: [
    CommonModule,
    FinancialsRoutingModule,
    ReactiveFormsModule,
    AccordionModule,
    PanelModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    CommonModule,
    TagInputModule,
    CoreModule,
    RouterModule,
    FormsModule,
  ],
  exports: [AddFinanceEstimateComponent],
}) 
export class FinancialsModule { }
