import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinanceEstimateComponent } from './edit-finance-estimate.component';

describe('EditFinanceEstimateComponent', () => {
  let component: EditFinanceEstimateComponent;
  let fixture: ComponentFixture<EditFinanceEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFinanceEstimateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFinanceEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
