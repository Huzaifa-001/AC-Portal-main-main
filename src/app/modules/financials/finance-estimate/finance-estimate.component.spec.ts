import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceEstimateComponent } from './finance-estimate.component';

describe('FinanceEstimateComponent', () => {
  let component: FinanceEstimateComponent;
  let fixture: ComponentFixture<FinanceEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceEstimateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
