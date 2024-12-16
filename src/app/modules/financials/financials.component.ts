import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css'],
})
export class FinancialsComponent implements OnInit {
  parentId!: string; // ID from the parent route (contact or job ID)
  basePath!: string; // Base path (e.g., /contact/:id or /jobs/:id)
  activeTab: string = 'estimates'; // Default active tab

  // Tab routes with their display names
  tabRoutes = [
    { displayName: 'Estimates', route: 'estimates' },
    { displayName: 'Budgets', route: 'budgets' },
    { displayName: 'Material Order', route: 'material-order' },
    { displayName: 'Invoices', route: 'invoices' },
    { displayName: 'Credit Memos', route: 'credit-memos' },
    { displayName: 'Payments', route: 'payments' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Get the parent ID from the route (contact or job ID)
    this.route.parent?.params.subscribe((params) => {
      this.parentId = params['id'];
      this.basePath = this.router.url.split('/financials')[0]; // Extract base path (e.g., /contact/:id or /jobs/:id)
    });

    // Subscribe to route changes to dynamically set active tab
    this.route.firstChild?.params.subscribe((params) => {
      const tab = params['tab'] || 'estimates'; // Default to 'estimates' if no tab is in the URL
      this.activeTab = tab;
    });

    // Redirect to 'estimates' by default if no tab is specified in the URL
    if (this.router.url.endsWith('/financials')) {
      this.router.navigate([this.activeTab], { relativeTo: this.route });
    }
  }

  // Change the active tab and navigate to the new tab's route
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([tab], { relativeTo: this.route });
  }
}
