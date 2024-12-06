import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactJobsComponent } from './contact-jobs.component';

describe('ContactJobsComponent', () => {
  let component: ContactJobsComponent;
  let fixture: ComponentFixture<ContactJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
