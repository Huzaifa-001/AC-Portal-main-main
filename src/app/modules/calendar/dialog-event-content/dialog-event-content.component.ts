import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskCreationDialogComponent } from '../../dashboard/task-creation-dialog/task-creation-dialog.component';
import { AddJobWorkOrderComponent } from '../../job/add-job-work-order/add-job-work-order.component';

@Component({
  selector: 'app-dialog-event-content',
  templateUrl: './dialog-event-content.component.html',
  styleUrls: ['./dialog-event-content.component.css']
})
export class DialogEventContentComponent {
  endTime = '';
  startTime = '';
  description = '';
  eventName = '';
  estimatedDuration: any = '';
  task: any;
  priority: any = '';
  type = '';

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogEventContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeFields();
  }

  private initializeFields(): void {
    if (this.data) {
      this.task = this.data.extendedProps.task;
      this.type = this.data.extendedProps.type;
      if (this.type === 'task') {
        this.eventName = this.task.taskName;
        this.startTime = this.task.startDate;
        this.endTime = this.task.endDate;
        this.description = this.task.description;
        this.estimatedDuration = this.task.estimatedDuration;
        this.priority = this.task.priority;
      } else {
        this.eventName = this.task.name;
        this.startTime = this.task.startDate;
        this.endTime = this.task.dueDate;
        this.description = this.task.description ?? '';
        this.estimatedDuration = this.task.estimatedDuration ?? 'Date';
        this.priority = this.task.workOrderPriority;
      }
    }
  }

  closeAddJobsModal(): void {
    this.dialogRef.close();
  }

  // Open a modal dialog based on the type of task
  openEventModal(): void {
    let dialogRef: any = {};
    const data = this.task;
    if (this.type === 'task') {
      data.FormTitle = 'Update Task';
      data.Request_Type = 'Update';
      dialogRef = this.dialog.open(TaskCreationDialogComponent, {
        width: '75vw',
        height: '70vh',
        data: data,
        disableClose: true
      });
    } else {
      data.FormTitle = 'Update Workorder';
      data.Request_Type = 'Update';
      dialogRef = this.dialog.open(AddJobWorkOrderComponent, {
        width: '75vw',
        maxWidth: '90vw',
        height: 'auto',
        maxHeight: '90vh',
        data: data,
        disableClose: true
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      this.dialogRef.close('update');
    });
  }
}
