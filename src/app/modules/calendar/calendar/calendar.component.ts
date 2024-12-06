import { Component, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { DialogEventContentComponent } from '../dialog-event-content/dialog-event-content.component';
import { AddJobEventComponent } from '../../job/add-job-event/add-job-event.component';
import { TaskCreationDialogComponent } from '../../dashboard/task-creation-dialog/task-creation-dialog.component';
import { TasksService } from 'src/app/core/services/tasks.service';
import { JobService } from 'src/app/core/services/job.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  events = [];
  calendarOptions: CalendarOptions =
    {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDidMount: this.eventDidMount.bind(this)
    };

  handleEventClick(info: any) {
    console.log(info.event)
    this.openEventModal(info.event);
  }

  eventDidMount(info: any) {
    const task = info.event.extendedProps.task;
    if (task) {
      const priority = task.type == 'task' ? task.priority : task.workOrderPriority
      if (priority) {
        const bgColor = this.getColorBasedOnPriority(priority);

        info.el.style.backgroundColor = bgColor
        info.el.style.borderColor = bgColor
        info.el.style.cursor = 'pointer';
        info.el.style.padding = '5px';
      }
    }
  }


  getColorBasedOnPriority(priority: string): string {
    switch (priority) {
      case 'High':
        return '#ea5455';
      case 'Medium':
        return '#ff9f43';
      case 'Low':
        return '#28c76f';
      default:
        return '#82868b';
    }
  }
  tasks: any[] = [];

  constructor(private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private taskService: TasksService,
    private jobService: JobService,
  ) { }

  ngOnInit() {
    this.loadTasks();
  }



  handleDateClick(info: any) {
    console.log(info);
    this.openAddEventModal(null);
  }

  openEventModal(event: any) {
    console.log(event)
    debugger
    const dialogRef = this.dialog.open(DialogEventContentComponent, {
      data: event
    });

    dialogRef.afterClosed().subscribe((result) => {
      debugger
      if (result === 'delete') {
        this.loadTasks();
      } else if (result === 'update') {
        this.loadTasks();
      }
    });
  }

  openAddEventModal(data: any): void {
    debugger
    console.log(data)
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = "Add Task";
      data.Request_Type = "Add";
      dialogRef = this.dialog.open(TaskCreationDialogComponent, {
        width: '50vw',
        height: '70vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result == "added")
          this.loadTasks();
      });
    }
  }

  loadTasks(): void {
    this.events = []
    forkJoin({
      tasks: this.taskService.getAllTasks(),
      workOrders: this.jobService.getAllWorkOrder()
    }).subscribe({
      next: (data: any) => {
        const taskEvents = data.tasks.payload?.map((task: any) => ({
          title: task.taskName + ' (Task)',
          extendedProps: {
            type: 'task',
            task: task
          },
          start: new Date(task.startDate).toISOString().split('T')[0],
          end: new Date(task.endDate ?? task.startDate).toISOString().split('T')[0],
        })) ?? [];
  
        const workOrderEvents = data.workOrders?.data?.map((task: any) => ({
          title: task.name + ' (Workorder)',
          extendedProps: {
            type: 'workOrder',
            task: task
          },
          start: new Date(task.startDate).toISOString().split('T')[0],
          end: new Date(task.dueDate ?? task.startDate).toISOString().split('T')[0],
        })) ?? [];
  
        this.events = [...taskEvents, ...workOrderEvents];
        this.updateCalendarEvents();
      },
      error: (error) => {
        console.log(error);
      }
    });


  }

  deleteEvent(event: any) {
    this.events = this.events.filter((e) => e !== event);
    this.updateCalendarEvents();
  }

  updateEvent(event: any) {
    event.title = 'Updated Event';
    this.updateCalendarEvents();
  }

  createEvent(date: string) {
    const newEvent = { title: 'New Event', start: date, end: date };
    this.events.push(newEvent);
    this.updateCalendarEvents();
  }

  private updateCalendarEvents() {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.events,
    };
    this.cdr.detectChanges();
  }
}
