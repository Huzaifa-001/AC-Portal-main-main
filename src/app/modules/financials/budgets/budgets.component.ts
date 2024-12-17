import { Component, OnInit } from '@angular/core';
import { BudgetDto } from './BudgetDto';
import { AppConfig } from 'src/app/core/app-config';
import { ToastrService } from 'ngx-toastr';
import { BudgetsService } from './budget.service';
import { MatDialog } from '@angular/material/dialog';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { EditBudgetComponent } from './edit-budget/edit-budget.component';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})
export class BudgetsComponent implements OnInit {
  budgets: BudgetDto[] = []; // List of estimates

  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize; // Page size from config

  constructor(
    private toastr: ToastrService,
    private budgetsService: BudgetsService,
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
    const dialogRef = this.dialog.open(AddBudgetComponent, {
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
  openBudgetDetail(budget: BudgetDto): void {
    const dialogRef = this.dialog.open(BudgetDetailComponent, {
      width: '600px',
      data: budget,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle modal close logic if needed
    });
  }

  // Edit estimate
  editBudget(budget: BudgetDto): void {
    const dialogRef = this.dialog.open(EditBudgetComponent, {
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
