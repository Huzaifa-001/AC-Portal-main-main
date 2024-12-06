import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobPhotoComponent } from './add-job-photo.component';

describe('AddJobPhotoComponent', () => {
  let component: AddJobPhotoComponent;
  let fixture: ComponentFixture<AddJobPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobPhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJobPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
