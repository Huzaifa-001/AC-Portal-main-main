import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AcinterceptorService } from './rootservices/acinterceptor.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CsvExportService } from './rootservices/csv-export-service.service';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { PaginationComponent } from './pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { SearchPipe } from './search.pipe';
import { CustomSortPipe } from './custom.sort.pipe';
import { DynamicFieldComponent } from './dynamic-field/dynamic-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    NavBarComponent,
    SideBarComponent,
    FooterComponent,
    ColorSliderComponent,
    PaginationComponent,
    SearchPipe,
    CustomSortPipe,
    DynamicFieldComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSnackBarModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
  ],
  exports : [
    PaginationComponent,
    DynamicFieldComponent,
    NavBarComponent,
    SideBarComponent,
    FooterComponent,
    ColorSliderComponent,
    SearchPipe,
    CustomSortPipe
  ],
  providers: [CsvExportService,{ provide: HTTP_INTERCEPTORS, useClass: AcinterceptorService, multi: true }],
})
export class CoreModule { }
