import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialOrderComponent } from './edit-material-order.component';

describe('EditMaterialOrderComponent', () => {
  let component: EditMaterialOrderComponent;
  let fixture: ComponentFixture<EditMaterialOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMaterialOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMaterialOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
