import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpAndSupportComponent } from './help-and-support/help-and-support.component';
import { HelpAndSupportRoutingModule } from './help-and-support-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  declarations: [
    HelpAndSupportComponent
  ],
  imports: [
    HelpAndSupportRoutingModule,
    CommonModule,
    MatExpansionModule,
    MatIconModule
  ]
})
export class HelpAndSupportModule { }
