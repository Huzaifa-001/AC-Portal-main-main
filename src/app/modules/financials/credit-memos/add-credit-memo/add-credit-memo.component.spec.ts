import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreditMemoComponent } from './add-credit-memo.component';

describe('AddCreditMemoComponent', () => {
  let component: AddCreditMemoComponent;
  let fixture: ComponentFixture<AddCreditMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCreditMemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCreditMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
