import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/core/app-config';
import { ContactService } from 'src/app/core/services/contact.service';
import { AddcontactComponent } from '../../contact/addcontact/addcontact.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';

@Component({
  selector: 'app-dashboard-contacts',
  templateUrl: './dashboard-contacts.component.html',
  styleUrls: ['./dashboard-contacts.component.css']
})
export class DashboardContactsComponent {
  pageSize: number = AppConfig.dashBoardPageSize;
  ContactSortField = '';
  ContactSortOrder: 'asc' | 'desc' = 'asc';
  ContactCurrentPageIndex: any = 1
  ContactTotalCount: number = 0

  contacts: any[] = [];
  subscriptions: Subscription = new Subscription();
  constructor(private dialog: MatDialog,
    private router: Router,
    private contactService: ContactService) { }

  ngOnInit() {
    this.loadContactPagedData(this.ContactCurrentPageIndex)
  }

  onContactSort(field: string) {
    this.ContactSortField = field;
    this.ContactSortOrder = this.ContactSortOrder === 'asc' ? 'desc' : 'asc';
  }

  redirectContact(contact: any) {
    this.router.navigate(['/contact', contact.id], {
      state: { model: contact },
    });
  }

  openAddContactModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Add Contact';
      data.Request_Type = 'Add';
      dialogRef = this.dialog.open(AddcontactComponent, {
        width: '75vw',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Edit Contact';
      data.Request_Type = 'Save';
      dialogRef = this.dialog.open(AddcontactComponent, {
        width: '80vw',
        height: '80vh',
        data: data,
        disableClose: true,
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadContactPagedData(this.ContactCurrentPageIndex)
    });
  }

  deleteContact(contact: any) {
    let dialogRef: any = {};
    contact.FormTitle = 'Confirm Delete';
    contact.Request_Type = 'Delete';
    dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: contact,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.contactService.deleteContact(contact?.id).subscribe({
          next: (res) => {
            console.log(res);
            this.loadContactPagedData(this.ContactCurrentPageIndex)
          },
          error: (res) => {
            console.log(res);
          },
        });
      }
    });
  }

  loadContactPagedData(pageIndex: number) {
    const dto = {
      pageIndex: pageIndex,
      pageSize: this.pageSize,
    };

    this.contactService.pagedData(dto).subscribe({
      next: (res) => {
        this.contacts = res.payload;
        this.ContactCurrentPageIndex = res.pageIndex;
        this.ContactTotalCount = Math.ceil(res.count / res.pageSize);
      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

}
