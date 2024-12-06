import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEstimatesComponent } from './dashboard-estimates.component';

describe('DashboardEstimatesComponent', () => {
  let component: DashboardEstimatesComponent;
  let fixture: ComponentFixture<DashboardEstimatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardEstimatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEstimatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
