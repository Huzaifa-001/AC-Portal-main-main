import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  reports = [];
  searchText: string = '';
  selectedOwner: string = '';
  selectedReportType: string = '';
  selectedSharedWith: string = '';
  startDate: string = '';
  endDate: string = '';
  filteredReports = [];
  uniqueOwners: string[] = [];
  uniqueReportTypes: string[] = [];
  uniqueSharedWith: string[] = [];
  paginatedReports = [];
  pageSize = 1; // Number of records to display per page
  currentPage = 1;
  isFirstPage: boolean;
  isLastPage: boolean;

  constructor(private router: Router) {

  }
  ngOnInit() {
    this.reports = [
      {
        name: 'Report 1',
        owner: 'John Doe',
        reportType: 'Sales',
        description: 'This is the first report.',
        sharedWith: ['UserA', 'UserB'],
        dateCreated: new Date('2023-08-06')
      },
      {
        name: 'Report 2',
        owner: 'Jane Smith',
        reportType: 'Marketing',
        description: 'This is the second report.',
        sharedWith: ['UserC', 'UserD', 'UserE'],
        dateCreated: new Date('2023-08-05')
      },
      {
        name: 'Report 3',
        owner: 'Bob Johnson',
        reportType: 'Finance',
        description: 'This is the third report.',
        sharedWith: ['UserF'],
        dateCreated: new Date('2023-08-04')
      },
    ];

    this.filteredReports = this.reports;
    // Initially, set both filteredReports and paginatedReports to all reports
    this.paginatedReports = this.reports.slice(0, this.pageSize);
    this.populateFilterOptions();
  }

  applyFilters() {
    this.filteredReports = this.reports.filter((report) => {
      const ownerMatch =
        !this.selectedOwner || report.owner.toLowerCase().includes(this.selectedOwner.toLowerCase());
      const reportTypeMatch =
        !this.selectedReportType ||
        report.reportType.toLowerCase().includes(this.selectedReportType.toLowerCase());
      const sharedWithMatch =
        !this.selectedSharedWith ||
        report.sharedWith.some((user) =>
          user.toLowerCase().includes(this.selectedSharedWith.toLowerCase())
        );
      const dateMatch =
        (!this.startDate || new Date(report.dateCreated) >= new Date(this.startDate)) &&
        (!this.endDate || new Date(report.dateCreated) <= new Date(this.endDate));
      const searchTextMatch =
        !this.searchText || report.name.toLowerCase().includes(this.searchText.toLowerCase());
  
      return ownerMatch && reportTypeMatch && sharedWithMatch && dateMatch && searchTextMatch;
    });

    this.currentPage = 1;
    this.paginateData();
  }
  
  resetFilters() {
    this.selectedOwner = '';
    this.selectedReportType = '';
    this.selectedSharedWith = '';
    this.startDate = null;
    this.endDate = null;
    this.searchText = ''; 
    // this.applyFilters();

     // Reset both filteredReports and paginatedReports to all reports
     this.filteredReports = this.reports;
     this.paginateData();
  }
  
// Function to handle pagination when changing pages
onPageChange(pageNumber: number) {
  this.currentPage = pageNumber;
  this.paginateData();
}

// Function to paginate the data based on current page
paginateData() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedReports = this.filteredReports.slice(startIndex, endIndex);

  // Check if current page is the first or last page and disable prev/next buttons accordingly
  const totalPageCount = Math.ceil(this.filteredReports.length / this.pageSize);
  this.isFirstPage = this.currentPage === 1;
  this.isLastPage = this.currentPage === totalPageCount;

}




  private populateFilterOptions() {
    this.uniqueOwners = this.reports.map((report) => report.owner).filter((value, index, self) => self.indexOf(value) === index);
    this.uniqueReportTypes = this.reports.map((report) => report.reportType).filter((value, index, self) => self.indexOf(value) === index);
    this.uniqueSharedWith = this.reports.reduce((uniqueUsers, report) => {
      report.sharedWith.forEach((user) => {
        if (!uniqueUsers.includes(user)) {
          uniqueUsers.push(user);
        }
      });
      return uniqueUsers;
    }, []);
  }

  getTotalPages() {
    return Array.from({ length: Math.ceil(this.filteredReports.length / this.pageSize) }, (_, index) => index + 1);
  }

  openAddReports() {
    this.router.navigate(['analytics/add-report'])
  }

  redirect(event: any) {
    // Implementation for redirecting goes here
  }

  deleteReportClick(event: any) {
    // Implementation for deleting a report goes here
  }
}
