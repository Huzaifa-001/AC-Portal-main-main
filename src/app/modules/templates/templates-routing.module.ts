import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmailAndSmsTemplatesComponent } from './email-and-sms-templates/email-and-sms-templates.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { SmsTemplatesComponent } from './sms-templates/sms-templates.component';

const routes: Routes = [
  {
    path: '',
    component: EmailAndSmsTemplatesComponent,
    children: [
      { path: '', component: EmailTemplatesComponent },
      { path: 'email', component: EmailTemplatesComponent },
      { path: 'sms', component: SmsTemplatesComponent },
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule {}
