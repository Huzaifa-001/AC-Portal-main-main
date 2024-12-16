import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AccountModule } from './account/account.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ToastrModule } from 'ngx-toastr';
import { ContactModule } from './modules/contact/contact.module';
import { CoreModule } from './core/core.module';
import * as Papa from 'papaparse';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { ColorPickerModule } from 'ngx-color-picker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    AppComponent,
    ConfirmationComponent,
    LoaderComponent,

   
  ],
  imports: [
    CoreModule,
    BrowserModule,
    MatTabsModule,
    AccountModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
  ],
  providers: [{ provide: 'Papa', useValue: Papa }],
  bootstrap: [AppComponent]
})
export class AppModule { }
