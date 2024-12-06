import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnalyticsCardsComponent } from './dashboard-analytics-cards.component';

describe('DashboardAnalyticsCardsComponent', () => {
  let component: DashboardAnalyticsCardsComponent;
  let fixture: ComponentFixture<DashboardAnalyticsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAnalyticsCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAnalyticsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
