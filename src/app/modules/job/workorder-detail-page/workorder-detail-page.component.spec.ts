import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderDetailPageComponent } from './workorder-detail-page.component';

describe('WorkorderDetailPageComponent', () => {
  let component: WorkorderDetailPageComponent;
  let fixture: ComponentFixture<WorkorderDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderDetailPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkorderDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
