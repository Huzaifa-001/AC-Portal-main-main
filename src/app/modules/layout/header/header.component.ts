import { Component, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddcontactComponent } from '../../contact/addcontact/addcontact.component';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from 'src/app/core/services/job.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { UserProfileComponent } from 'src/app/account/user-profile/user-profile.component';
import { SubscriptionPlansComponent } from '../../subscription/subscription-plans/subscription-plans.component';
import { AddJobsComponent } from '../../job/add-jobs/add-jobs.component';
import { TaskCreationDialogComponent } from '../../dashboard/task-creation-dialog/task-creation-dialog.component';
import { AddJobWorkOrderComponent } from '../../job/add-job-work-order/add-job-work-order.component';
import { WorkorderDetailPageComponent } from '../../job/workorder-detail-page/workorder-detail-page.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { AccountService } from 'src/app/core/services/account.service';
import { UserDTO } from 'src/app/core/interfaces';
interface SearchDTO {
  jobs: SearchResponseDto[];
  contacts: SearchResponseDto[];
  workOrders: SearchResponseDto[];
}

// Interface for a single search result
interface SearchResponseDto {
  id: number;
  jobId?: any;
  name: string;
  description: string;
  isJob: string;
  isContact: string;
  isWorkOrder: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;
  userProfilePicture = null
  unreadCount = 0
  searchResults: SearchDTO;
  showResults = false;
  searchKeyword = ""
  user: UserDTO;
  constructor(private router: Router, 
    private dialog: MatDialog, 
    private jobService: JobService, 
    private notificationService: NotificationService,
    private accountService: AccountService,
  ) {
    this.getNotificationCount()

  }

  getNotificationCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) =>
        this.unreadCount = count,
      error: () =>
        console.log("Error while fetching count")
    })
    this.notificationService.fetchUnreadCount();
  }


  ngOnInit() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Adjust the delay time as needed (300ms in this example)
        distinctUntilChanged(),
        switchMap((keyword: string) => {
          if (!keyword) {
            this.showResults = false;
            return [];
          }
          return this.jobService.SearchAll(keyword);
        })
      )
      .subscribe((res) => {
        this.searchResults = res;
        this.showResults = true;
      });

      this.accountService.getPhotoUrl().subscribe(res => {
        this.userProfilePicture = res
      })
      this.user = this.accountService.getUser()
  }

  loadNotifications() {
    console.log('Emitting refreshNotifications');
    this.notificationService.requestNotificationsUpdate()
  }

  viewProfile() {
    // Logic to navigate to the profile page

    let dialogRef: any = {};
    let data: any = {};
    data.FormTitle = 'Profile';
    data.Request_Type = 'Add';
    dialogRef = this.dialog.open(UserProfileComponent, {
      width: '85vw',
      data: data,
      disableClose: true,
    });

  }

  viewSubscription() {
    // Logic to navigate to the profile page

    let dialogRef: any = {};
    let data: any = {};
    data.FormTitle = 'Subscription Plans';
    data.Request_Type = 'Add';
    dialogRef = this.dialog.open(SubscriptionPlansComponent, {
      width: '85vw',
      data: data,
      disableClose: true,
    });

  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/'])
  }

  openAddContactModal(): void {
    let dialogRef: any = {};
    let data: any = {};
    data.FormTitle = 'Add Contact';
    data.Request_Type = 'Add';
    dialogRef = this.dialog.open(AddcontactComponent, {
      width: '75vw',
      data: data,
      disableClose: true,
    });
  }

  openAddJobModal(): void {
    let dialogRef: any = {};
    let data: any = {};
    data.FormTitle = 'Add Job';
    data.Request_Type = 'Add';
    dialogRef = this.dialog.open(AddJobsComponent, {
      width: '75vw',
      data: data,
      disableClose: true,
    });
  }

  openAddTaskModal(): void {
    let dialogRef: any = {};
    let data: any = {};
    data.FormTitle = 'Add Task';
    data.Request_Type = 'Add';
    dialogRef = this.dialog.open(TaskCreationDialogComponent, {
      width: '75vw',
      data: data,
      disableClose: true,
    });
  }

  redirectTo(url: string) {
    this.showResults = false
    this.router.navigate([url]);
  }

  onSearchInput(keyword: string): void {
    this.searchKeyword = keyword;
    this.searchSubject.next(keyword);
  }

  previewWorkOrder(id: any) {
    debugger
    let dialogRef: any = {};
    let data: any = {};
    data.FormTitle = 'Add Task';
    data.Request_Type = 'Add';
    dialogRef = this.dialog.open(WorkorderDetailPageComponent, {
      width: '75vw',
      data: {
        id: id
      },
      disableClose: true,
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
