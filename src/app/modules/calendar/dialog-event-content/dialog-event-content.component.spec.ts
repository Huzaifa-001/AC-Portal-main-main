import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEventContentComponent } from './dialog-event-content.component';

describe('DialogEventContentComponent', () => {
  let component: DialogEventContentComponent;
  let fixture: ComponentFixture<DialogEventContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEventContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEventContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
