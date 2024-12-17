import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditMemoComponent } from './edit-credit-memo.component';

describe('EditCreditMemoComponent', () => {
  let component: EditCreditMemoComponent;
  let fixture: ComponentFixture<EditCreditMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCreditMemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCreditMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
