import { Component, OnInit } from '@angular/core';
import { InvoiceDto } from './InvoiceDto';
import { AppConfig } from 'src/app/core/app-config';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from './invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit {
  invoices: InvoiceDto[] = []; // List of estimates

  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize; // Page size from config

  constructor(
    private toastr: ToastrService,
    private invoiceService: InvoiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInvoices(this.currentPageIndex);
  }

  // Load all estimates with pagination
  loadInvoices(pageIndex: number): void {
    const relatedValue = 'Contact 1'; // Example static value or dynamically set
    this.invoiceService
      .getAllInvoice(relatedValue, pageIndex, this.pageSize)
      .subscribe((data) => {
        this.invoices = data.payload;
        this.totalCount = data.totalCount;
        this.currentPageIndex = data.pageIndex;
      });
  }

  // Pagination handler (when page changes)
  onPageChange(pageIndex: number): void {
    this.loadInvoices(pageIndex);
  }

  // Open Add Estimate modal
  openAddInvoiceModal(): void {
    const dialogRef = this.dialog.open(AddInvoiceComponent, {
      width: '90%',
      data: {}, // Pass any required data for the new estimate
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.invoiceService.addInvoice(result).subscribe((updatedInvoices) => {
          this.invoices = updatedInvoices;
          this.toastr.success('Invoice added successfully!');
        });
      }
    });
  }

  // Open Estimate Detail modal on row click
  openInvoiceDetail(invoice: InvoiceDto): void {
    const dialogRef = this.dialog.open(InvoiceDetailComponent, {
      width: '600px',
      data: invoice,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle modal close logic if needed
    });
  }

  // Edit estimate
  editInvoice(invoice: InvoiceDto): void {
    const dialogRef = this.dialog.open(EditInvoiceComponent, {
      width: '600px',
      data: invoice, // Pass the estimate for editing
    });

    dialogRef.afterClosed().subscribe((updatedInvoice) => {
      if (updatedInvoice) {
        this.invoiceService
          .updateInvoice(updatedInvoice)
          .subscribe((updatedInvoice) => {
            this.invoices = updatedInvoice;
            this.toastr.success('Invoice updated successfully!');
          });
      }
    });
  }

  // Delete estimate with confirmation
  deleteInvoice(invoiceNumber: string): void {
    const confirmation = confirm(
      'Are you sure you want to delete this Invoice?'
    );
    if (confirmation) {
      this.invoiceService
        .deleteInvoice(invoiceNumber)
        .subscribe((updatedinvoices) => {
          this.invoices = updatedinvoices;
          this.toastr.success('Invoice deleted successfully!');
        });
    }
  }
}
