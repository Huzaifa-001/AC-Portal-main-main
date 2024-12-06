import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTasksComponent } from './contact-tasks.component';

describe('ContactTasksComponent', () => {
  let component: ContactTasksComponent;
  let fixture: ComponentFixture<ContactTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
