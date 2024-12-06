import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachementsComponent } from './attachements.component';

describe('AttachementsComponent', () => {
  let component: AttachementsComponent;
  let fixture: ComponentFixture<AttachementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
