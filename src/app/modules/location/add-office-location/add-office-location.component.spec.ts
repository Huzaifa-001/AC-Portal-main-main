import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfficeLocationComponent } from './add-office-location.component';

describe('AddOfficeLocationComponent', () => {
  let component: AddOfficeLocationComponent;
  let fixture: ComponentFixture<AddOfficeLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfficeLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOfficeLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
