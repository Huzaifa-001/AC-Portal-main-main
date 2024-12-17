import { Component } from '@angular/core';
import { AddMaterialOrderComponent } from './add-material-order/add-material-order.component';
import { MaterialOrderDetailComponent } from './material-order-detail/material-order-detail.component';
import { EditMaterialOrderComponent } from './edit-material-order/edit-material-order.component';
import { MaterialOrderDto } from './MarterialOrderDto';
import { ToastrService } from 'ngx-toastr';
import { MaterialOrderService } from './material-order.service';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-material-order',
  templateUrl: './material-order.component.html',
  styleUrls: ['./material-order.component.css'],
})
export class MaterialOrderComponent {
  materialOrders: MaterialOrderDto[] = []; // List of estimates

  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize; // Page size from config

  constructor(
    private toastr: ToastrService,
    private materialOrderService: MaterialOrderService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMaterialOrders(this.currentPageIndex);
  }

  // Load all estimates with pagination
  loadMaterialOrders(pageIndex: number): void {
    const relatedValue = 'Contact 1'; // Example static value or dynamically set
    this.materialOrderService
      .getAllMaterialOrders(relatedValue, pageIndex, this.pageSize)
      .subscribe((data) => {
        this.materialOrders = data.payload;
        this.totalCount = data.totalCount;
        this.currentPageIndex = data.pageIndex;
      });
  }

  // Pagination handler (when page changes)
  onPageChange(pageIndex: number): void {
    this.loadMaterialOrders(pageIndex);
  }

  // Open Add Estimate modal
  openAddMaterialOrderModal(): void {
    const dialogRef = this.dialog.open(AddMaterialOrderComponent, {
      width: '90%',
      data: {}, // Pass any required data for the new estimate
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.materialOrderService
          .addMaterialOrder(result)
          .subscribe((updatedMaterialOrders) => {
            this.materialOrders = updatedMaterialOrders;
            this.toastr.success('Material Order added successfully!');
          });
      }
    });
  }

  // Open Estimate Detail modal on row click
  openMaterialOrderDetail(materialOrder: MaterialOrderDto): void {
    const dialogRef = this.dialog.open(MaterialOrderDetailComponent, {
      width: '600px',
      data: materialOrder,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle modal close logic if needed
    });
  }

  // Edit estimate
  editMaterialOrder(materialOrder: MaterialOrderDto): void {
    const dialogRef = this.dialog.open(EditMaterialOrderComponent, {
      width: '600px',
      data: materialOrder, // Pass the estimate for editing
    });

    dialogRef.afterClosed().subscribe((updatedMaterialOrder) => {
      if (updatedMaterialOrder) {
        this.materialOrderService
          .updateMaterialOrder(updatedMaterialOrder)
          .subscribe((updatedMaterialOrders) => {
            this.materialOrders = updatedMaterialOrders;
            this.toastr.success('Material Order updated successfully!');
          });
      }
    });
  }

  // Delete estimate with confirmation
  deleteMaterialOrder(MaterialOrderNumber: string): void {
    const confirmation = confirm(
      'Are you sure you want to delete this Material Order?'
    );
    if (confirmation) {
      this.materialOrderService
        .deleteMaterialOrder(MaterialOrderNumber)
        .subscribe((updatedMaterialOrders) => {
          this.materialOrders = updatedMaterialOrders;
          this.toastr.success('Material Order deleted successfully!');
        });
    }
  }
}
