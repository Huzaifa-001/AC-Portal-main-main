import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationsListComponent } from './automations-list.component';

describe('AutomationsListComponent', () => {
  let component: AutomationsListComponent;
  let fixture: ComponentFixture<AutomationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
