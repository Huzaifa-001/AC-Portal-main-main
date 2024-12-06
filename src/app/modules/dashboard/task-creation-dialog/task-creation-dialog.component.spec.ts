import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreationDialogComponent } from './task-creation-dialog.component';

describe('TaskCreationDialogComponent', () => {
  let component: TaskCreationDialogComponent;
  let fixture: ComponentFixture<TaskCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskCreationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
