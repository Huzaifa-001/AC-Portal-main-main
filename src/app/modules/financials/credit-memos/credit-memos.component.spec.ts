import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMemosComponent } from './credit-memos.component';

describe('CreditMemosComponent', () => {
  let component: CreditMemosComponent;
  let fixture: ComponentFixture<CreditMemosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditMemosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
