import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EstimateDetailComponent } from './estimate-detail/estimate-detail.component';
import { EstimateDto } from './EstimateDto';
import { EstimatesService } from './estimate.service';
import { AddEstimateComponent } from './add-estimate/add-estimate.component';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.css'],
})
export class EstimatesComponent implements OnInit {
  estimates: EstimateDto[] = []; // List of estimates

  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize; // Page size from config

  constructor(
    private toastr: ToastrService,
    private estimatesService: EstimatesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEstimates(this.currentPageIndex);
  }

  // Load all estimates with pagination
  loadEstimates(pageIndex: number): void {
    const relatedValue = 'Contact 1'; // Example static value or dynamically set
    this.estimatesService
      .getAllEstimates(relatedValue, pageIndex, this.pageSize)
      .subscribe((data) => {
        this.estimates = data.payload;
        this.totalCount = data.totalCount;
        this.currentPageIndex = data.pageIndex;
      });
  }

  // Pagination handler (when page changes)
  onPageChange(pageIndex: number): void {
    this.loadEstimates(pageIndex);
  }

  // Open Add Estimate modal
  openAddEstimateModal(): void {
    const dialogRef = this.dialog.open(AddEstimateComponent, {
      width: '90%',
      data: {}, // Pass any required data for the new estimate
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.estimatesService
          .addEstimate(result)
          .subscribe((updatedEstimates) => {
            this.estimates = updatedEstimates;
            this.toastr.success('Estimate added successfully!');
          });
      }
    });
  }

  // Open Estimate Detail modal on row click
  openEstimateDetail(estimate: EstimateDto): void {
    const dialogRef = this.dialog.open(EstimateDetailComponent, {
      width: '90%',
      data: estimate,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle modal close logic if needed
    });
  }

  // Edit estimate
  editEvent(estimate: EstimateDto): void {
    const dialogRef = this.dialog.open(AddEstimateComponent, {
      width: '600px',
      data: estimate, // Pass the estimate for editing
    });

    dialogRef.afterClosed().subscribe((updatedEstimate) => {
      if (updatedEstimate) {
        this.estimatesService
          .updateEstimate(updatedEstimate)
          .subscribe((updatedEstimates) => {
            this.estimates = updatedEstimates;
            this.toastr.success('Estimate updated successfully!');
          });
      }
    });
  }

  // Delete estimate with confirmation
  deleteEvent(estimateNumber: string): void {
    const confirmation = confirm(
      'Are you sure you want to delete this estimate?'
    );
    if (confirmation) {
      this.estimatesService
        .deleteEstimate(estimateNumber)
        .subscribe((updatedEstimates) => {
          this.estimates = updatedEstimates;
          this.toastr.success('Estimate deleted successfully!');
        });
    }
  }
}
