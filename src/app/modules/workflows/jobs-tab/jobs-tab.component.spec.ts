import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsTabComponent } from './jobs-tab.component';

describe('JobsTabComponent', () => {
  let component: JobsTabComponent;
  let fixture: ComponentFixture<JobsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
