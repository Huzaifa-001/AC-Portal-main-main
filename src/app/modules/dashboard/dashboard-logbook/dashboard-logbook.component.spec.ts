import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLogbookComponent } from './dashboard-logbook.component';

describe('DashboardLogbookComponent', () => {
  let component: DashboardLogbookComponent;
  let fixture: ComponentFixture<DashboardLogbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLogbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLogbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
