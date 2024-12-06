import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contactdetail',
  templateUrl: './locationdetail.component.html',
  styleUrls: ['./locationdetail.component.css']
})
export class LocationdetailComponent {
  contact: any;

  constructor(private route: ActivatedRoute, private dialog: MatDialog,public contactService: ContactService,) {
    this.route.paramMap.subscribe(params => {
      const contactId =  params.get('id');
      this.contact = history.state.model;
      this.contact.startDate = new Date(this.contact?.startDate)
      console.log(this.contact)
    });
  }
}
