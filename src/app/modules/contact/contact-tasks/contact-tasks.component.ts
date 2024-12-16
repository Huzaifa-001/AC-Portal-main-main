import { Component } from '@angular/core';
import { TaskCreationDialogComponent } from '../../dashboard/task-creation-dialog/task-creation-dialog.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from 'src/app/core/services/tasks.service';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-contact-tasks',
  templateUrl: './contact-tasks.component.html',
  styleUrls: ['./contact-tasks.component.css'],
})
export class ContactTasksComponent {
  contactId: any;
  tasks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private tasksService: TasksService
  ) {
    this.contactId = this.route.parent.snapshot.paramMap.get('id');
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  ngOnInit() {
    this.loadTasks(this.currentPageIndex);
  }

  loadTasks(pageIndex: number) {
    this.tasksService
      .getTasksByRelatedContactId(this.contactId)
      .subscribe((res) => {
        this.tasks = [];
        this.tasks = res.payload;
        // this.totalCount = this.logBooks.length;
        this.currentPageIndex = res?.pageIndex ?? 1;
      });
  }

  deleteTask(task: any): void {
    let dialogRef: any = {};
    task.FormTitle = 'Confirm Delete';
    task.Request_Type = 'Delete';
    dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: task,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.tasksService.deleteTask(task.id).subscribe(
          (data) => {
            console.log('Task deleted successfully:', data);
            // Reload the task list after deletion
            this.loadTasks(this.currentPageIndex);
          },
          (error) => {
            console.error('Error deleting task:', error);
            // Handle error, display an error message, etc.
          }
        );
      }
    });
  }

  openAddTaskModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Add Task';
      data.Request_Type = 'Add';
      dialogRef = this.dialog.open(TaskCreationDialogComponent, {
        width: '75vw',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Edit Task';
      data.Request_Type = 'Save';
      dialogRef = this.dialog.open(TaskCreationDialogComponent, {
        width: '75vw',
        data: data,
        disableClose: true,
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadTasks(this.currentPageIndex);
    });
  }
}
