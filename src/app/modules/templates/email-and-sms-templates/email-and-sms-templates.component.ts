import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-and-sms-templates',
  templateUrl: './email-and-sms-templates.component.html',
  styleUrls: ['./email-and-sms-templates.component.css']
})
export class EmailAndSmsTemplatesComponent {
  selectedTabIndex: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    const routePath = this.route.snapshot.firstChild?.routeConfig?.path;
    this.updateSelectedTab(routePath)
  }

  onTabChanged(event: MatTabChangeEvent) {
    const tabLabels = ['email', 'sms'];
    const selectedTabLabel = tabLabels[event.index];

    // Navigate to the selected route
    this.router.navigate(['settings/templates', selectedTabLabel]);
    this.selectedTabIndex = event.index;
  }

  private updateSelectedTab(routePath: string) {
    const tabLabels = ['email', 'sms'];
    const tabLabel = routePath.split('/').pop(); // Extract the last segment of the route path
    const tabIndex = tabLabels.indexOf(tabLabel);
    this.selectedTabIndex = tabIndex !== -1 ? tabIndex : 0;
  }
  
}
