import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialOrderDetailComponent } from './material-order-detail.component';

describe('MaterialOrderDetailComponent', () => {
  let component: MaterialOrderDetailComponent;
  let fixture: ComponentFixture<MaterialOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialOrderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
