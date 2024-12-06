import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location/location.component';
import { LocationdetailComponent } from './locationdetail/locationdetail.component';

const routes: Routes = [
  {path: '', component: LocationComponent},
  {path: 'details', component: LocationdetailComponent},
  // { path: ':id', component: ProjectDetailsComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LocationRoutingModule { }
