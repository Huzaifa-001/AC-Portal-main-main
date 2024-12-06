import { Component } from '@angular/core';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-contact-financials',
  templateUrl: './contact-financials.component.html',
  styleUrls: ['./contact-financials.component.css']
})
export class ContactFinancialsComponent {
  currentPageIndex: number = 1;
  totalCount: number = 100; // Mock total count
  pageSize: number = AppConfig.pageSize;
  estimates = [
    {
      estimateNumber: 'EST-001',
      date: new Date(),
      notes: 'First Estimate',
      syncedToQB: 'Yes',
      signed: 'No',
      total: 1500,
      status: 'Pending',
    },{
      estimateNumber: 'EST-001',
      date: new Date(),
      notes: 'First Estimate',
      syncedToQB: 'Yes',
      signed: 'No',
      total: 1500,
      status: 'Pending',
    },
    // Add more mock data or fetch from an API
  ];

  loadPagedData(pageIndex: number) {
    console.log('Loading page:', pageIndex);
    // Fetch data from API or update the table data
  }

  deleteClick(estimate: any): void {
    console.log('Deleting estimate:', estimate);
    // Implement delete functionality
  }
}