import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinanceInvoiceComponent } from './edit-finance-invoice.component';

describe('EditFinanceInvoiceComponent', () => {
  let component: EditFinanceInvoiceComponent;
  let fixture: ComponentFixture<EditFinanceInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFinanceInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFinanceInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
