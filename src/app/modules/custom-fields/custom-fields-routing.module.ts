import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomfieldsComponent } from './customfields/customfields.component';

const routes: Routes = [
  {
    path: '',
    component: CustomfieldsComponent,
    children: [
      { path: '', redirectTo: 'contact', pathMatch: 'full' },
      { path: 'contact', component: CustomfieldsComponent },      
      { path: 'job', component: CustomfieldsComponent },
      { path: 'workorder', component: CustomfieldsComponent },
      { path: 'attachment', component: CustomfieldsComponent },
      { path: 'note', component: CustomfieldsComponent },
      { path: 'task', component: CustomfieldsComponent },
      { path: 'source', component: CustomfieldsComponent },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomFieldsRoutingModule { }
