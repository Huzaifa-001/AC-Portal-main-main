import { Component } from '@angular/core';
import { TaskCreationDialogComponent } from '../task-creation-dialog/task-creation-dialog.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { TasksService } from 'src/app/core/services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { Subscription } from 'rxjs';
import { TaskDto } from '../../contact/TaskDto';

@Component({
  selector: 'app-dashboard-tasks',
  templateUrl: './dashboard-tasks.component.html',
  styleUrls: ['./dashboard-tasks.component.css']
})
export class DashboardTasksComponent {
  pageSize: number = AppConfig.dashBoardPageSize;
  subscriptions: Subscription = new Subscription();
  tasks: TaskDto[] = []
  constructor(private dialog: MatDialog, private taskService: TasksService, private router: Router) { }

  ngOnInit() {
    this.loadTasks();
  }

  openTaskCreationDialog(data: any = null): void {
    if (data == null) {
      data = {
        FormTitle: 'Add Task',
        Request_Type: 'Add',
      };
    } else {
      data.FormTitle = 'Edit Task';
      data.Request_Type = 'Save';
    }
    const dialogRef = this.dialog.open(TaskCreationDialogComponent, {
      width: '650px',
      data: data
      // You can add other dialog configuration options here
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle the result or perform actions after the dialog is closed.
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      {
        next: (data: any) => {
          this.tasks = data.payload;
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
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
        this.taskService.deleteTask(task.id).subscribe(
          (data) => {
            console.log('Task deleted successfully:', data);
            // Reload the task list after deletion
            this.loadTasks();
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
      this.loadTasks()
    });
  }
}
