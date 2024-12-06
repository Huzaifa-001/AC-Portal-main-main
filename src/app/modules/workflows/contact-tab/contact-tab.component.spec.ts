import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTabComponent } from './contact-tab.component';

describe('ContactTabComponent', () => {
  let component: ContactTabComponent;
  let fixture: ComponentFixture<ContactTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
