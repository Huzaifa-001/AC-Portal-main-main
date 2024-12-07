import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RelatedContactDetailsComponent } from '../related-contact-details/related-contact-details.component';
import { ContactService } from 'src/app/core/services/contact.service';
import { AddcontactComponent } from '../addcontact/addcontact.component';

@Component({
  selector: 'app-contactdetail',
  templateUrl: './contactdetail.component.html',
  styleUrls: ['./contactdetail.component.css']
})
export class ContactdetailComponent {
  contact: any;
  contactId: any
  constructor(private route: ActivatedRoute, private dialog: MatDialog,public contactService: ContactService,) {
    this.route.paramMap.subscribe(params => {
      this.contactId =  params.get('id');
      this.getDetails()
    });
  }

  getDetails(){
    this.contactService.getContactById(Number(this.contactId)).subscribe({
      next: (res) => {
        this.contact = res.payload
      },
      error: (err) => { 
        this.contact = history.state.model;
        this.contact.startDate = new Date(this.contact?.startDate)
        this.contact.endDate = new Date(this.contact?.endDate)
        console.log(this.contact)
      }
    })
  }

  openRelatedContactModal(data:any): void {
    let dialogRef: any = {};
    dialogRef = this.dialog.open(RelatedContactDetailsComponent, {
      width: '50vw',
      height: '50vh',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result:any) => {  
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
      this.getDetails()
    });
  }

}
