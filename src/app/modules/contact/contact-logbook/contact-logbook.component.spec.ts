import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactLogbookComponent } from './contact-logbook.component';

describe('ContactLogbookComponent', () => {
  let component: ContactLogbookComponent;
  let fixture: ComponentFixture<ContactLogbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactLogbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactLogbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
