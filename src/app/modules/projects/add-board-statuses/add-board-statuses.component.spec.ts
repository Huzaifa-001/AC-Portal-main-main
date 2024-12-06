import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoardStatusesComponent } from './add-board-statuses.component';

describe('AddBoardStatusesComponent', () => {
  let component: AddBoardStatusesComponent;
  let fixture: ComponentFixture<AddBoardStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBoardStatusesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBoardStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
