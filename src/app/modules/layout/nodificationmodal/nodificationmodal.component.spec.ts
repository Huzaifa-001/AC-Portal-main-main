import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodificationmodalComponent } from './nodificationmodal.component';

describe('NodificationmodalComponent', () => {
  let component: NodificationmodalComponent;
  let fixture: ComponentFixture<NodificationmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodificationmodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodificationmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
