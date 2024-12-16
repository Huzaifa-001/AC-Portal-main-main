import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuradService } from './core/rootservices/AuthGuradService';

const routes: Routes = [
  
  {
    path: '',
    loadChildren: () => import('src/app/modules/layout/layout.module').then(m => m.LayoutModule),
  },
  
  { path: 'financials', loadChildren: () => import('./modules/financials/financials.module').then(m => m.FinancialsModule) },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
  // }
  // {path: '', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  // {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  // {path: 'contact', canActivate: [AuthGuradService],
  //  loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)},
   
  //  {path: 'jobs', canActivate: [AuthGuradService],
  //  loadChildren: () => import('./job/job.module').then(m => m.JobModule)},
  // {path: 'home'
  // , canActivate: [AuthGuradService]
  // , component: HomeComponent},
  // {
  //   path: '**'
  //   , loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {useHash : true } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
