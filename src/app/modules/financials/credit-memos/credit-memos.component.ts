import { Component } from '@angular/core';
import { CreditMemoDto } from './CreditMemoDto';
import { EditCreditMemoComponent } from './edit-credit-memo/edit-credit-memo.component';
import { AppConfig } from 'src/app/core/app-config';
import { ToastrService } from 'ngx-toastr';
import { CreditMemoService } from './credit-memo.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCreditMemoComponent } from './add-credit-memo/add-credit-memo.component';
import { CreditMemoDetailComponent } from './credit-memo-detail/credit-memo-detail.component';

@Component({
  selector: 'app-credit-memos',
  templateUrl: './credit-memos.component.html',
  styleUrls: ['./credit-memos.component.css'],
})
export class CreditMemosComponent {
  creditMemos: CreditMemoDto[] = [
    {
      creditMemoNumber: 'Credit Memo 1',
      relatedRecords: [],
      status: 'Pending',
      total: 1322,
      creditMemoDate: new Date(),
      dateUpdated: new Date(),
      lineItems: [],
      internalNote: 'Nothing Here',
    },
  ];
  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize; // Page size from config

  constructor(
    private toastr: ToastrService,
    private creditMemoService: CreditMemoService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCreditMemos(this.currentPageIndex);
  }

  // Load all estimates with pagination
  loadCreditMemos(pageIndex: number): void {
    const relatedValue = 'Contact 1'; // Example static value or dynamically set
    this.creditMemoService
      .getAllCreditMemos(relatedValue, pageIndex, this.pageSize)
      .subscribe((data) => {
        this.creditMemos = data.payload;
        this.totalCount = data.totalCount;
        this.currentPageIndex = data.pageIndex;
      });
  }

  // Pagination handler (when page changes)
  onPageChange(pageIndex: number): void {
    this.loadCreditMemos(pageIndex);
  }

  // Open Add Estimate modal
  openAddCreditMemoModal(): void {
    const dialogRef = this.dialog.open(AddCreditMemoComponent, {
      width: '90%',
      data: {}, // Pass any required data for the new estimate
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.creditMemoService
          .addCreditMemos(result)
          .subscribe((updatedCreditMemos) => {
            this.creditMemos = updatedCreditMemos;
            this.toastr.success('Credit Memos added successfully!');
          });
      }
    });
  }

  // Open Estimate Detail modal on row click
  openCreditMemoDetail(creditMemo: CreditMemoDto): void {
    const dialogRef = this.dialog.open(CreditMemoDetailComponent, {
      width: '90%',
      data: creditMemo,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle modal close logic if needed
    });
  }

  // Edit estimate
  editCreditMemo(creditMemo: CreditMemoDto): void {
    const dialogRef = this.dialog.open(EditCreditMemoComponent, {
      width: '90%',
      data: creditMemo, // Pass the estimate for editing
    });

    dialogRef.afterClosed().subscribe((updatedCreditMemo) => {
      if (updatedCreditMemo) {
        this.creditMemoService
          .updateCreditMemo(updatedCreditMemo)
          .subscribe((updatedCreditMemos) => {
            this.creditMemos = updatedCreditMemos;
            this.toastr.success('Credit Memo updated successfully!');
          });
      }
    });
  }

  // Delete estimate with confirmation
  deleteCreditMemo(creditMemoNumber: string): void {
    const confirmation = confirm(
      'Are you sure you want to delete this estimate?'
    );
    if (confirmation) {
      this.creditMemoService
        .deleteCreditMemo(creditMemoNumber)
        .subscribe((updatedCreditMemo) => {
          this.creditMemos = updatedCreditMemo;
          this.toastr.success('Credit Memo deleted successfully!');
        });
    }
  }
}
