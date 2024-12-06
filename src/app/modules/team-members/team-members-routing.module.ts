import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TeamMembersComponent } from './team-members/team-members.component';

const routes: Routes = [
  {
    path: '',
    component: TeamMembersComponent,
    // children: [
    //   { path: '', component: EmailTemplatesComponent },
    //   { path: 'email', component: EmailTemplatesComponent },
    //   { path: 'sms', component: SmsTemplatesComponent },
    // ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMembersRoutingModule {}
