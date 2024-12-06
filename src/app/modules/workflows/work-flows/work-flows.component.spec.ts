import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowsComponent } from './work-flows.component';

describe('WorkFlowsComponent', () => {
  let component: WorkFlowsComponent;
  let fixture: ComponentFixture<WorkFlowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
