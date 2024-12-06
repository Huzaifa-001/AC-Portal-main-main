import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SubscriptionPlansComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    CoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SubscriptionModule { }
