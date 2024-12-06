import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-work-flows',
  templateUrl: './work-flows.component.html',
  styleUrls: ['./work-flows.component.css']
})
export class WorkFlowsComponent {
  selectedTabIndex: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    debugger
    const routePath = this.route.snapshot.firstChild?.routeConfig?.path;
    this.updateSelectedTab(routePath)
  }

  onTabChanged(event: MatTabChangeEvent) {
    const tabLabels = ['contacts', 'jobs', 'work-orders', 'global-status'];
    const selectedTabLabel = tabLabels[event.index];

    // Navigate to the selected route
    this.router.navigate(['settings/workflows/'+selectedTabLabel]);
    this.selectedTabIndex = event.index;
  }

  private updateSelectedTab(routePath: string) {
    const tabLabels = ['contacts', 'jobs', 'work-orders', 'global-status'];
    const tabIndex = tabLabels.indexOf(routePath);
    this.selectedTabIndex = tabIndex !== -1 ? tabIndex : 0;
  }
}
