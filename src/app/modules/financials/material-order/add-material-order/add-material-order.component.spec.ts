import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialOrderComponent } from './add-material-order.component';

describe('AddMaterialOrderComponent', () => {
  let component: AddMaterialOrderComponent;
  let fixture: ComponentFixture<AddMaterialOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
