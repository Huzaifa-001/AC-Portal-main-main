import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinanceBudgetComponent } from './add-finance-budget.component';

describe('AddFinanceBudgetComponent', () => {
  let component: AddFinanceBudgetComponent;
  let fixture: ComponentFixture<AddFinanceBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFinanceBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFinanceBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
