import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsLogbookComponent } from './projects-logbook.component';

describe('ProjectsLogbookComponent', () => {
  let component: ProjectsLogbookComponent;
  let fixture: ComponentFixture<ProjectsLogbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsLogbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsLogbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
