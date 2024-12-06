import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsLogbookComponent } from './jobs-logbook.component';

describe('JobsLogbookComponent', () => {
  let component: JobsLogbookComponent;
  let fixture: ComponentFixture<JobsLogbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsLogbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsLogbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
