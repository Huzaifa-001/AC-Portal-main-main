import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancePaymentsComponent } from './finance-payments.component';

describe('FinancePaymentsComponent', () => {
  let component: FinancePaymentsComponent;
  let fixture: ComponentFixture<FinancePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancePaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
