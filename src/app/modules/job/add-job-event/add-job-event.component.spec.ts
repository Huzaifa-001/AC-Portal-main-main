import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobEventComponent } from './add-job-event.component';

describe('AddJobEventComponent', () => {
  let component: AddJobEventComponent;
  let fixture: ComponentFixture<AddJobEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJobEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
