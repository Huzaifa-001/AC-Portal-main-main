import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/core/app-config';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contact-logbook',
  templateUrl: './contact-logbook.component.html',
  styleUrls: ['./contact-logbook.component.css']
})
export class ContactLogbookComponent {
  contactId: any;
  logBooks: any[] = [];

  constructor(private route: ActivatedRoute, private contactService: ContactService) {
    this.contactId = this.route.parent.snapshot.paramMap.get('id');
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  ngOnInit() {
    this.loadPagedData(this.currentPageIndex);
  }

  loadPagedData(pageIndex: number) {
    this.contactService.getLogsByContactId(this.contactId).subscribe((res) => {
      this.logBooks = []
      this.logBooks =  res
      this.totalCount = this.logBooks.length;
      this.currentPageIndex = res?.pageIndex ?? 1;
    });
  }
  
}
