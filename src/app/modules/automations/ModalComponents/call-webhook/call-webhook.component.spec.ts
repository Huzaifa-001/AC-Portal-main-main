import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallWebhookComponent } from './call-webhook.component';

describe('CallWebhookComponent', () => {
  let component: CallWebhookComponent;
  let fixture: ComponentFixture<CallWebhookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallWebhookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallWebhookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
