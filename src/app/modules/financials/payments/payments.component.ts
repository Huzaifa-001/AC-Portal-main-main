import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/core/app-config';
import { MatDialog } from '@angular/material/dialog';

import { PaymentDto } from './PaymentDto';
import { PaymentService } from './payment.service';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  payments: PaymentDto[] = [];

  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize; // Page size from config

  constructor(
    private toastr: ToastrService,
    private paymentService: PaymentService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPayments(this.currentPageIndex);
  }

  // Load all estimates with pagination
  loadPayments(pageIndex: number): void {
    const relatedValue = 'Contact 1'; // Example static value or dynamically set
    this.paymentService
      .getAllPayments(relatedValue, pageIndex, this.pageSize)
      .subscribe((data) => {
        this.payments = data.payload;
        this.totalCount = data.totalCount;
        this.currentPageIndex = data.pageIndex;
      });
  }

  // Pagination handler (when page changes)
  onPageChange(pageIndex: number): void {
    this.loadPayments(pageIndex);
  }

  // Open Add Estimate modal
  openAddPaymentModal(): void {
    const dialogRef = this.dialog.open(AddPaymentComponent, {
      width: '90%',
      data: {}, // Pass any required data for the new estimate
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentService.addPayment(result).subscribe((updatedPayments) => {
          this.payments = updatedPayments;
          this.toastr.success('Payment added successfully!');
        });
      }
    });
  }

  // Open Estimate Detail modal on row click
  openPaymentDetail(payment: PaymentDto): void {
    const dialogRef = this.dialog.open(PaymentDetailComponent, {
      width: '90%',
      data: payment,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle modal close logic if needed
    });
  }

  // Edit estimate
  editPayment(payment: PaymentDto): void {
    const dialogRef = this.dialog.open(EditPaymentComponent, {
      width: '90%',
      data: payment, // Pass the estimate for editing
    });

    dialogRef.afterClosed().subscribe((updatedPayment) => {
      if (updatedPayment) {
        this.paymentService
          .updatePayment(updatedPayment)
          .subscribe((updatedPayments) => {
            this.payments = updatedPayments;
            this.toastr.success('Payment updated successfully!');
          });
      }
    });
  }

  // Delete estimate with confirmation
  deletePayment(paymentId: number): void {
    const confirmation = confirm(
      'Are you sure you want to delete this payment?'
    );
    if (confirmation) {
      this.paymentService
        .deletePayment(paymentId)
        .subscribe((updatedPayment) => {
          this.payments = updatedPayment;
          this.toastr.success('Payment deleted successfully!');
        });
    }
  }
}
