import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DashboardComponentConfig } from 'src/app/core/interfaces/DashboardComponentConfig';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-organize-dashboard',
  templateUrl: './organize-dashboard.component.html',
  styleUrls: ['./organize-dashboard.component.css']
})
export class OrganizeDashboardComponent implements OnDestroy {
  private subscription: Subscription[] = [];
  visibleComponents: DashboardComponentConfig[] = [];
  hiddenComponents: DashboardComponentConfig[] = [];
  AvailableComponents: DashboardComponentConfig[] = [];

  constructor(
    private configService: ConfigService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<OrganizeDashboardComponent>
  ) {
    this.loadConfiguration();
  }

  async loadConfiguration() {
    try {
      const dashboardConfigs = await this.configService.getDashboardConfigs();
      debugger
      this.AvailableComponents = dashboardConfigs;
      this.visibleComponents = this.AvailableComponents.filter(item => item.isVisible);
      this.hiddenComponents = this.AvailableComponents.filter(item => !item.isVisible);
    } catch (error) {
      console.error('Error loading dashboard configurations:', error);
    }
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  drop(event: CdkDragDrop<DashboardComponentConfig[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateVisibleOrder();
    }
  }

  private updateVisibleOrder() {
    this.visibleComponents.forEach((item, index) => {
      item.order = index + 1;
    });
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  disableItem(item: DashboardComponentConfig) {
    item.isVisible = false;
    this.visibleComponents = this.visibleComponents.filter(i => i !== item);
    this.hiddenComponents.push(item);
  }

  enableItem(item: DashboardComponentConfig) {
    item.isVisible = true;
    this.hiddenComponents = this.hiddenComponents.filter(i => i !== item);
    this.visibleComponents.push(item);
    this.updateVisibleOrder();
  }

  async saveOrder() {
    const combinedList = this.getCombinedList();
    try {
      await this.configService.updateDashboardConfigs(combinedList);
      this.snackBar.open('Dashboard configurations saved successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.dialogRef.close(true);
    } catch (error) {
      this.snackBar.open('Error saving dashboard configurations', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
  

  private getCombinedList(): DashboardComponentConfig[] {
    return [...this.visibleComponents, ...this.hiddenComponents];
  }
}
