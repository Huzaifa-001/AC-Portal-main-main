import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoActionComponent } from './auto-action.component';

describe('AutoActionComponent', () => {
  let component: AutoActionComponent;
  let fixture: ComponentFixture<AutoActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
