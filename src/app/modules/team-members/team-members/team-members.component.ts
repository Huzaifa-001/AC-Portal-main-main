import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { AddTeamMemberComponent } from '../add-team-member/add-team-member.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { OfficeLocationService } from 'src/app/core/services/OfficeLocation/office-location.service';
import { forkJoin, Subscription, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent {
  @ViewChild('teamMembersTable') table!: HTMLTableElement;
  private subscriptions: Subscription = new Subscription();

  teamMembers: any[] = [];
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;
  officeLocations: any[] = [];
  states: any[] = [];
  timeZones: any[] = [];
  constructor(
    private router: Router,
    private contactService: ContactService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private csvExportService: CsvExportService,
    private officeLocationService: OfficeLocationService,
  ) {}
  
  ngOnInit() {
    this.loadInitialData().subscribe({
      next: () => {
        this.loadPagedData(this.currentPageIndex);
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
      }
    });
  }
  
  private loadInitialData() {
    // Use forkJoin to wait for all initial data to load
    return forkJoin({
      officeLocations: this.contactService.allOfficeLocations(),
      states: this.contactService.allState(),
      timeZones: this.officeLocationService.getTimeZones()
    }).pipe(
      tap(({ officeLocations, states, timeZones }) => {
        // Assign the data to component properties
        this.officeLocations = officeLocations.payload;
        this.states = states.payload;
        this.timeZones = timeZones.payload;
      })
    );
  }
  
  loadPagedData(pageIndex: number) {
    this.contactService.allPagedTeamMembers(pageIndex,this.pageSize).subscribe({
      next: (res) => {
         this.teamMembers = res.payload.data;
         this.currentPageIndex = res.payload.pageIndex;
         this.totalCount = Math.ceil(res.payload.count / res.payload.pageSize);
          this.teamMembers.forEach(member => {
            const state = this.states.find(s => s.id === member.state);
            member.stateName = state ? state.name : 'Unknown State';
            const office = this.officeLocations.find(o => o.id === member.businessLocation);
            member.officeName = office ? office.name : 'Unknown Office';
            const timeZone = this.timeZones.find(t => t.id === member.timeZone);
            member.timeZoneName = timeZone ? timeZone.name : 'Unknown Time Zone';
          });
       },
      error: (err) => {
         console.log(err);
       }}
     );
  }

  redirect(contact: any) {
    this.router.navigate(['/contact', contact.id], {
      state: { model: contact },
    });
  }

  openAddTeamMemberModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Add Team Member';
      data.Request_Type = 'Add';
      dialogRef = this.dialog.open(AddTeamMemberComponent, {
        width: '75vw',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Edit Team Member';
      data.Request_Type = 'Save';
      dialogRef = this.dialog.open(AddTeamMemberComponent, {
        width: '80vw',
        height: '80vh',
        data: data,
        disableClose: true,
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadPagedData(this.currentPageIndex)
    });
  }


  //Pending
  deleteTeamMember(contact: any) {
    let data = {
      FormTitle: 'Confirm Delete',
      Request_Type: 'Delete',
      message: "Are you sure you want to Delete this team member?"
    };
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.contactService.deleteTeamMembers(contact?.id).subscribe({
          next: (res) => {
            this.showSuccess('Team member deleted successfully.');
            this.loadPagedData(this.currentPageIndex)

          },
          error: (res) => {
            this.showError('Error deleting team member.');
          },
        });
      }
    });
  }


  unblockTeamMember(id: any) {
    let teamMember = {
      FormTitle: 'Confirm Unblock',
      Request_Type: 'Unblock',
      message: "Are you sure you want to unblock this team member?"
    };
  
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: teamMember,
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.contactService.UnBlockTeamMembers(id).subscribe({
          next: (res) => {
            console.log(res);
            this.showSuccess('Team member unblocked successfully.');
            this.loadPagedData(this.currentPageIndex);
          },
          error: (res) => {
            this.showError('Error unblocking team member.');
            console.log(res);
          },
        });
      }
    });
  }

  blockTeamMember(id: any) {
    let teamMember = {
      FormTitle: 'Confirm Block',
      Request_Type: 'Block',
      message: "Are you sure you want to block this team member?"
    };
  
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: teamMember,
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.contactService.BlockTeamMembers(id).subscribe({
          next: (res) => {
            this.showSuccess('Team member blocked successfully.');
            this.loadPagedData(this.currentPageIndex);
          },
          error: (res) => {
            this.showError('Error blocking team member.');
            console.log(res);
          },
        });
      }
    });
  }
  
  
  

  

  importContacts(): void {
    const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
    fileInput.click();
  }
  searchText = ""

  handleFileSelection(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file && file.type === 'text/csv') {
      this.csvExportService.importCsvFile(file)
        .then((data: any[]) => {
          console.log(data);
          const headers = data[0]; // Get headers from the first array
          const teamMembers = data.slice(1).map((row: string[]) => {
            const contact: any = {};
            headers.forEach((header: string, index: number) => {
              contact[header] = row[index];
            });
            return contact;
          });
          // Handle imported teamMembers (array of objects) here
          console.log(teamMembers);
        })
        .catch((error: any) => {
          console.error('Error importing CSV:', error);
        });
    } else {
      console.error('Invalid file format. Please select a CSV file.');
    }
  }

  exportTable() {
    this.csvExportService.exportTableToCsv(this.table, 'exported-contact.csv');
  }

  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
  


  private showError(message: string) {
    this.toastr.error(message, 'Error', {
      timeOut: 3000,
      closeButton: true
    });
  }

  private showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      timeOut: 3000,
      closeButton: true
    });
  }
}

