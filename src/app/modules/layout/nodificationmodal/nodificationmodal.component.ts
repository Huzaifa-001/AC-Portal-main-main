import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JobService } from 'src/app/core/services/job.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-nodificationmodal',
  templateUrl: './nodificationmodal.component.html',
  styleUrls: ['./nodificationmodal.component.scss']
})
export class NodificationmodalComponent {
  unreadCount: number = 0;
  notifications: any[] = [];
  constructor(private router: Router, private dialog: MatDialog, private jobService: JobService, private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.notificationService.refreshNotifications.subscribe(() => {
      this.loadNotifications();
    });
  }

  loadNotifications() {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) =>
        this.unreadCount = count,
      error: () =>
        console.log("Error while fetching count")
    })

    this.notificationService.getAllNotifications().subscribe({
      next: (res) => {
        if (res && res.data && res.data.notifications.length > 0) {
          this.notifications = res.data.notifications.filter(notification => notification.isRead !== true);
          this.notificationService.updateUnreadCount(res.data.unreadCount ?? 0)
        } else {
          this.notifications = [];
        }
      },
      error: (err) => {
        console.error("Error fetching notifications:", err);
      }
    });
  }

  formatDate(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    let diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const timeUnits = [
      { unit: 'second', value: 60 },
      { unit: 'minute', value: 60 },
      { unit: 'hour', value: 24 },
      { unit: 'day', value: 30 },
      { unit: 'month', value: 12 },
      { unit: 'year', value: Infinity }
    ];

    let unit = 'just now';
    let amount = 0;

    for (const { unit: currentUnit, value } of timeUnits) {
      if (diffInSeconds < value) {
        amount = Math.floor(diffInSeconds);
        unit = currentUnit;
        break;
      }
      diffInSeconds /= value;
    }

    return `${amount} ${unit}${amount > 1 ? 's' : ''} ago`;
  }

  markAsRead(notificationId: any): void {
    this.notificationService.markNotificationAsRead(notificationId).subscribe({
      next: () => this.loadNotifications()
    })
  }

  markAllAsRead(): void {
    this.notificationService.markAllNotificationsAsRead().subscribe({
      next: () => this.loadNotifications()
    })
  }

  viewAll() {
    this.router.navigate(['dashboard/notifications']);
  }

  RedirectTo(url: string | null) {
    if (url)
      this.router.navigateByUrl(url)
  }

}
