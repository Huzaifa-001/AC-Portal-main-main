import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPhotosComponent } from './contact-photos.component';

describe('ContactPhotosComponent', () => {
  let component: ContactPhotosComponent;
  let fixture: ComponentFixture<ContactPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPhotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
