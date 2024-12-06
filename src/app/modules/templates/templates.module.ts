import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmailTemplateComponent } from './add-email-template/add-email-template.component';
import { AddSmsTemplateComponent } from './add-sms-template/add-sms-template.component';
import { EmailAndSmsTemplatesComponent } from './email-and-sms-templates/email-and-sms-templates.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { SmsTemplatesComponent } from './sms-templates/sms-templates.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { TagInputModule } from 'ngx-chips';
import { TemplatesRoutingModule } from './templates-routing.module';
import { CoreModule } from 'src/app/core/core.module';



@NgModule({
  declarations: [
    EmailAndSmsTemplatesComponent,
    EmailTemplatesComponent,
    SmsTemplatesComponent,
    AddSmsTemplateComponent,
    AddEmailTemplateComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    TemplatesRoutingModule,
    ReactiveFormsModule,
    MatChipsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    TagInputModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatCheckboxModule
  ]
})
export class TemplatesModule { }
