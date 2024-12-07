import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceMaterialOrdersComponent } from './finance-material-orders.component';

describe('FinanceMaterialOrdersComponent', () => {
  let component: FinanceMaterialOrdersComponent;
  let fixture: ComponentFixture<FinanceMaterialOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceMaterialOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceMaterialOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
