import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomFieldsRoutingModule } from './custom-fields-routing.module';
import { CustomfieldsComponent } from './customfields/customfields.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
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
import { CoreModule } from 'src/app/core/core.module';
import { AddCustomFieldComponent } from './add-custom-field/add-custom-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    CustomfieldsComponent,
    AddCustomFieldComponent
  ],
  imports: [
    CommonModule,
    CustomFieldsRoutingModule,
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
    MatCheckboxModule,
    CoreModule,
    MatTabsModule
  ]
})
export class CustomFieldsModule { }
