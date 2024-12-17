import { Component, OnInit } from '@angular/core';
import { MaterialOrderDto } from '../material-order/MarterialOrderDto';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/core/app-config';
import { MaterialOrderService } from '../material-order/material-order.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMaterialOrderComponent } from '../material-order/add-material-order/add-material-order.component';
import { MaterialOrderDetailComponent } from '../material-order/material-order-detail/material-order-detail.component';
import { EditMaterialOrderComponent } from '../material-order/edit-material-order/edit-material-order.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  budgets: MaterialOrderDto[] = []; // List of estimates

  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize; // Page size from config

  constructor(
    private toastr: ToastrService,
    private budgetsService: MaterialOrderService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBudgets(this.currentPageIndex);
  }

  // Load all estimates with pagination
  loadBudgets(pageIndex: number): void {
    const relatedValue = 'Contact 1'; // Example static value or dynamically set
    this.budgetsService
      .getAllBudgets(relatedValue, pageIndex, this.pageSize)
      .subscribe((data) => {
        this.budgets = data.payload;
        this.totalCount = data.totalCount;
        this.currentPageIndex = data.pageIndex;
      });
  }

  // Pagination handler (when page changes)
  onPageChange(pageIndex: number): void {
    this.loadBudgets(pageIndex);
  }

  // Open Add Estimate modal
  openAddBudgetModal(): void {
    const dialogRef = this.dialog.open(AddMaterialOrderComponent, {
      width: '90%',
      data: {}, // Pass any required data for the new estimate
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.budgetsService.addBudget(result).subscribe((updatedBudgets) => {
          this.budgets = updatedBudgets;
          this.toastr.success('Budget added successfully!');
        });
      }
    });
  }

  // Open Estimate Detail modal on row click
  openBudgetDetail(budget: MaterialOrderDto): void {
    const dialogRef = this.dialog.open(MaterialOrderDetailComponent, {
      width: '600px',
      data: budget,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle modal close logic if needed
    });
  }

  // Edit estimate
  editBudget(budget: MaterialOrderDto): void {
    const dialogRef = this.dialog.open(EditMaterialOrderComponent, {
      width: '600px',
      data: budget, // Pass the estimate for editing
    });

    dialogRef.afterClosed().subscribe((updatedBudget) => {
      if (updatedBudget) {
        this.budgetsService
          .updateBudget(updatedBudget)
          .subscribe((updatedBudgets) => {
            this.budgets = updatedBudgets;
            this.toastr.success('Budget updated successfully!');
          });
      }
    });
  }

  // Delete estimate with confirmation
  deleteBudget(budgetNumber: string): void {
    const confirmation = confirm(
      'Are you sure you want to delete this budget?'
    );
    if (confirmation) {
      this.budgetsService
        .deleteBudget(budgetNumber)
        .subscribe((updatedBudgets) => {
          this.budgets = updatedBudgets;
          this.toastr.success('Budget deleted successfully!');
        });
    }
  }
}
