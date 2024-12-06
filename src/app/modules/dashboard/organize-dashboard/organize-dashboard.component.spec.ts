import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizeDashboardComponent } from './organize-dashboard.component';

describe('OrganizeDashboardComponent', () => {
  let component: OrganizeDashboardComponent;
  let fixture: ComponentFixture<OrganizeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
