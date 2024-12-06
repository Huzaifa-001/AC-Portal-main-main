import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobWorkOrderComponent } from './add-job-work-order.component';

describe('AddJobWorkOrderComponent', () => {
  let component: AddJobWorkOrderComponent;
  let fixture: ComponentFixture<AddJobWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobWorkOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJobWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
