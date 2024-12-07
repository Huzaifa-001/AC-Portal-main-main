import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinanceInvoiceComponent } from './add-finance-invoice.component';

describe('AddFinanceInvoiceComponent', () => {
  let component: AddFinanceInvoiceComponent;
  let fixture: ComponentFixture<AddFinanceInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFinanceInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFinanceInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
