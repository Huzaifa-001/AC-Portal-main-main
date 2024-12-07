import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contact-financials',
  templateUrl: './contact-financials.component.html',
  styleUrls: ['./contact-financials.component.css']
})
export class ContactFinancialsComponent implements OnInit {
  contactId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public contactService: ContactService
  ) {}

  ngOnInit(): void {
    // Fetch 'id' from parent route
    this.route.parent?.paramMap.subscribe((params) => {
      this.contactId = params.get('id');
    });
  }
}
