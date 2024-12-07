import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinanceMaterialOrdersComponent } from './add-finance-material-orders.component';

describe('AddFinanceMaterialOrdersComponent', () => {
  let component: AddFinanceMaterialOrdersComponent;
  let fixture: ComponentFixture<AddFinanceMaterialOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFinanceMaterialOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFinanceMaterialOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
