import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAttachmentsComponent } from './contact-attachments.component';

describe('ContactAttachmentsComponent', () => {
  let component: ContactAttachmentsComponent;
  let fixture: ComponentFixture<ContactAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
