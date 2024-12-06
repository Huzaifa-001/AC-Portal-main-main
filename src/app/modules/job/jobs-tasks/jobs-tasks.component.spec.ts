import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsTasksComponent } from './jobs-tasks.component';

describe('JobsTasksComponent', () => {
  let component: JobsTasksComponent;
  let fixture: ComponentFixture<JobsTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
