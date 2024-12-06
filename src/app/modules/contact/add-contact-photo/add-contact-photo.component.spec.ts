import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactPhotoComponent } from './add-contact-photo.component';

describe('AddContactPhotoComponent', () => {
  let component: AddContactPhotoComponent;
  let fixture: ComponentFixture<AddContactPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContactPhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContactPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
