import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalStatusTabComponent } from './global-status-tab.component';

describe('GlobalStatusTabComponent', () => {
  let component: GlobalStatusTabComponent;
  let fixture: ComponentFixture<GlobalStatusTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalStatusTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalStatusTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
