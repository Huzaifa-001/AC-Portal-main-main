import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TagInputModule } from 'ngx-chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreModule } from 'src/app/core/core.module';
import { MatDialogModule } from '@angular/material/dialog';
import { LocationComponent } from './location/location.component';
import { LocationdetailComponent } from './locationdetail/locationdetail.component';
import { LocationRoutingModule } from './location-routing.module';
import { AddOfficeLocationComponent } from './add-office-location/add-office-location.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    LocationComponent,
    LocationdetailComponent,
    AddOfficeLocationComponent,
  ],
  imports: [
    LocationRoutingModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonModule,
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
    CoreModule,
    MatTabsModule
  ],
  exports: []
})
export class LocationModule { }
