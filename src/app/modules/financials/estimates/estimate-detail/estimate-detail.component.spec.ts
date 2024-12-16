import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateDetailComponent } from './estimate-detail.component';

describe('EstimateDetailComponent', () => {
  let component: EstimateDetailComponent;
  let fixture: ComponentFixture<EstimateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
