import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFinancialsComponent } from './contact-financials.component';

describe('ContactFinancialsComponent', () => {
  let component: ContactFinancialsComponent;
  let fixture: ComponentFixture<ContactFinancialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactFinancialsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
