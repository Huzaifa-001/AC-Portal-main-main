import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersTabComponent } from './work-orders-tab.component';

describe('WorkOrdersTabComponent', () => {
  let component: WorkOrdersTabComponent;
  let fixture: ComponentFixture<WorkOrdersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrdersTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrdersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
