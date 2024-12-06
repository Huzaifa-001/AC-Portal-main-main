import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { MatDialogModule } from '@angular/material/dialog';


const routes: Routes = [
  {path: '', component: CalendarComponent},
  // { path: ':id', component: ProjectDetailsComponent },
]

@NgModule({
  declarations: [
     
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CalendarRoutingModule { }
