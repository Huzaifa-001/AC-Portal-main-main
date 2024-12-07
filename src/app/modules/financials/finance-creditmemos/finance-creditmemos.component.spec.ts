import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceCreditmemosComponent } from './finance-creditmemos.component';

describe('FinanceCreditmemosComponent', () => {
  let component: FinanceCreditmemosComponent;
  let fixture: ComponentFixture<FinanceCreditmemosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceCreditmemosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceCreditmemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
