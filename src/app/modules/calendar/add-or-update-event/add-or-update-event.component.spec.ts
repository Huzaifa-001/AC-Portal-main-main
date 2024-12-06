import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateEventComponent } from './add-or-update-event.component';

describe('AddOrUpdateEventComponent', () => {
  let component: AddOrUpdateEventComponent;
  let fixture: ComponentFixture<AddOrUpdateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrUpdateEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrUpdateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
