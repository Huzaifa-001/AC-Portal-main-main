import { Component, OnInit } from '@angular/core';
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
export class MaterialOrderComponent implements OnInit {
  materialOrders: MaterialOrderDto[] = [];
  currentPageIndex: number = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  isLoading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private materialOrderService: MaterialOrderService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMaterialOrders(this.currentPageIndex);
  }

  loadMaterialOrders(pageIndex: number): void {
    this.isLoading = true;
    const relatedValue = 'Contact 1';
    this.materialOrderService
      .getAllMaterialOrders(relatedValue, pageIndex, this.pageSize)
      .subscribe({
        next: (data) => {
          this.materialOrders = data.payload;
          this.totalCount = data.totalCount;
          this.currentPageIndex = data.pageIndex;
        },
        error: () => this.toastr.error('Failed to load material orders.'),
        complete: () => (this.isLoading = false),
      });
  }

  onPageChange(pageIndex: number): void {
    this.loadMaterialOrders(pageIndex);
  }

  openAddMaterialOrderModal(): void {
    this.openDialog(AddMaterialOrderComponent).subscribe((result) => {
      if (result) {
        this.materialOrderService.addMaterialOrder(result).subscribe({
          next: (updatedMaterialOrders) => {
            this.materialOrders = updatedMaterialOrders;
            this.toastr.success('Material Order added successfully!');
          },
          error: () => this.toastr.error('Failed to add Material Order.'),
        });
      }
    });
  }

  openMaterialOrderDetail(materialOrder: MaterialOrderDto): void {
    this.openDialog(MaterialOrderDetailComponent, materialOrder);
  }

  editMaterialOrder(materialOrder: MaterialOrderDto): void {
    this.openDialog(EditMaterialOrderComponent, materialOrder).subscribe((updatedMaterialOrder) => {
      if (updatedMaterialOrder) {
        this.materialOrderService.updateMaterialOrder(updatedMaterialOrder).subscribe({
          next: (updatedMaterialOrders) => {
            this.materialOrders = updatedMaterialOrders;
            this.toastr.success('Material Order updated successfully!');
          },
          error: () => this.toastr.error('Failed to update Material Order.'),
        });
      }
    });
  }

  deleteMaterialOrder(materialOrderNumber: string): void {
    const confirmation = confirm('Are you sure you want to delete this Material Order?');
    if (confirmation) {
      this.materialOrderService.deleteMaterialOrder(materialOrderNumber).subscribe({
        next: (updatedMaterialOrders) => {
          this.materialOrders = updatedMaterialOrders;
          this.toastr.success('Material Order deleted successfully!');
        },
        error: () => this.toastr.error('Failed to delete Material Order.'),
      });
    }
  }

  private openDialog(component: any, data?: any) {
    const dialogRef = this.dialog.open(component, {
      width: data ? '600px' : '90%',
      data: data || {},
    });
    return dialogRef.afterClosed();
  }
}
