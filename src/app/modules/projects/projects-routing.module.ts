import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './boards/boards.component';
import { BoardDetailsComponent } from './board-details/board-details.component';

const routes: Routes = [
  {
    path:'', component:BoardsComponent
  },
  {
    path:':id', component:BoardDetailsComponent
  },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProjectsRoutingModule { }
