import { Component, ComponentFactoryResolver, OnInit, AfterViewInit, ViewChild, ViewContainerRef, Type, ChangeDetectorRef } from '@angular/core';
import { DashboardTasksComponent } from '../dashboard-tasks/dashboard-tasks.component';
import { DashboardJobsComponent } from '../dashboard-jobs/dashboard-jobs.component';
import { DashboardContactsComponent } from '../dashboard-contacts/dashboard-contacts.component';
import { DashboardEstimatesComponent } from '../dashboard-estimates/dashboard-estimates.component';
import { ConfigService } from 'src/app/core/services/config.service';
import { DashboardComponentConfig } from 'src/app/core/interfaces/DashboardComponentConfig';
import { OrganizeDashboardComponent } from '../organize-dashboard/organize-dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { UserActivityComponent } from '../user-activity/user-activity.component';
import { DashboardLogbookComponent } from '../dashboard-logbook/dashboard-logbook.component';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  components: { [key: string]: any } = {
    'Tasks': DashboardTasksComponent,
    'Jobs': DashboardJobsComponent,
    'Contacts': DashboardContactsComponent,
    'Estimates': DashboardEstimatesComponent,
    'Logbook': DashboardLogbookComponent,
  };
  configs: DashboardComponentConfig[] = [];
  constructor(private cdr: ChangeDetectorRef, private configService: ConfigService, private dialog: MatDialog) { }

  @ViewChild('componentHost', { read: ViewContainerRef }) componentHost!: ViewContainerRef;

  ngOnInit() {
    this.loadDashboardConfigs();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadComponents();
      this.cdr.detectChanges();
    }, 0);
  }

  private loadDashboardConfigs() {
    this.configService.getDashboardConfigs().then(configs => {
      this.configs = configs;
      this.loadComponents(); // Ensure components are loaded after configs are fetched
    });
  }

  loadComponents() {
    if (this.componentHost) {
      this.componentHost.clear();
      this.configs
        .filter(config => config.isVisible)
        .sort((a, b) => a.order - b.order)
        .forEach(config => {
          const component = this.components[config.componentName];
          if (component) {
            const factory = this.componentHost.createComponent(component);
            factory.location.nativeElement.style.order = config.order;
          }
        });
    } else {
      console.error('componentHost is not defined');
    }
  }


  openOrganizeDashboardDialog(): void {
    const dialogRef = this.dialog.open(OrganizeDashboardComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.loadDashboardConfigs()
      }
    });
  }
}
