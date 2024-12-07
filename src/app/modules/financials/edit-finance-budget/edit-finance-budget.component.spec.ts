import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinanceBudgetComponent } from './edit-finance-budget.component';

describe('EditFinanceBudgetComponent', () => {
  let component: EditFinanceBudgetComponent;
  let fixture: ComponentFixture<EditFinanceBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFinanceBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFinanceBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
