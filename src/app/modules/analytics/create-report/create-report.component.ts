import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent {
  reportForm: FormGroup;
  shareWithOptions: string[] = ['Myself', 'Everyone', 'Groups', 'Certain Users'];
  groupOptions: string[] = ['Group 1', 'Group 2', 'Group 3']; // Replace with actual group options
  userOptions: string[] = ['User 1', 'User 2', 'User 3']; // Replace with actual user options
  appliedCalculations: string[] = []; // Track applied calculations
  appliedCalculationsTop: string[] = [];y
  addedFilters: string[] = []; 
  selectedRemoveColumn: string = '';
  selectedAddColumn: string = '';

  reports: any[] = [
    {
      name: 'Report 1',
      owner: 'User 1',
      reportType: 'Type A',
      description: 'Description 1',
      sharedWith: ['User 2', 'User 3'],
      dateCreated: new Date(),
      additionalColumn1: 'Additional Data 1',
      additionalColumn2: 'Additional Data 2',
    },
    {
      name: 'Report 2',
      owner: 'User 2',
      reportType: 'Type B',
      description: 'Description 2',
      sharedWith: ['User 1', 'User 3'],
      dateCreated: new Date(),
      additionalColumn1: 'Additional Data 3',
      additionalColumn2: 'Additional Data 4',
    },
    // Add more dummy data as needed
  ];

  constructor(private router: Router) {}

  goBack() {
    // Navigate to the "analytics" route
    this.router.navigate(['/analytics']);
  }

  tableColumns = [
    { name: 'name', header: 'NAME' },
    { name: 'reportType', header: 'REPORT TYPE' },
    { name: 'description', header: 'DESCRIPTION' },
    { name: 'owner', header: 'OWNER' },
    { name: 'sharedWith', header: 'SHARED WITH' },
    { name: 'dateCreated', header: 'DATE CREATED' },
    { name: 'additionalColumn1', header: 'ADDITIONAL COLUMN 1' },
    { name: 'additionalColumn2', header: 'ADDITIONAL COLUMN 2' },
    // Add more columns as needed
  ];  

  ngOnInit() {
    this.reportForm = new FormGroup({
      reportName: new FormControl('', Validators.required),
      description: new FormControl(''),
      shareWith: new FormControl('Myself', Validators.required),
      selectedGroup: new FormControl(''),
      selectedUser: new FormControl(''),
    });
  }

  onSubmit() {
    if (this.reportForm.valid) {
      // Handle form submission here
      console.log(this.reportForm.value);
    } else {
      // Form is invalid, show error messages if needed
    }
  }


  addedColumns = this.tableColumns.slice(0, 4);
  availableColumns = this.tableColumns.slice(4);

  addColumn(column: any): void {
    this.addedColumns.push(column);
    this.availableColumns = this.availableColumns.filter(c => c !== column);
  }

  removeColumn(column: any): void {
    this.availableColumns.push(column);
    this.addedColumns = this.addedColumns.filter(c => c !== column);
  }

  addFilter(column: any) {
    this.addedFilters.push(column.header+": User name i.e")
  }

  editFilter(filter: string) {
  }

  deleteFilter(filter: string) {
    
  }

  addCalculation(column: any) {
    this.appliedCalculations.push(column.header)
  }

  editCalculation(calculation: string) {
    // Implement the logic to edit the applied calculation
    console.log(`Edit calculation: ${calculation}`);
  }

  deleteCalculation(calculation: string) {
    const index = this.appliedCalculations.indexOf(calculation);
    if (index !== -1) {
      this.appliedCalculations.splice(index, 1);
    }
  }
}
