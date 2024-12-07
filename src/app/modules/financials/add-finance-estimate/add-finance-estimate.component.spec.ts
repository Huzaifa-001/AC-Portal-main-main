import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinanceEstimateComponent } from './add-finance-estimate.component';

describe('AddFinanceEstimateComponent', () => {
  let component: AddFinanceEstimateComponent;
  let fixture: ComponentFixture<AddFinanceEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFinanceEstimateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFinanceEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
