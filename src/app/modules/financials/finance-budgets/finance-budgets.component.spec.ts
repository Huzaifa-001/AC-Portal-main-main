import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBudgetsComponent } from './finance-budgets.component';

describe('FinanceBudgetsComponent', () => {
  let component: FinanceBudgetsComponent;
  let fixture: ComponentFixture<FinanceBudgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceBudgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
