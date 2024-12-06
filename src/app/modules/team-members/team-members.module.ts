import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { TeamMembersRoutingModule } from './team-members-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';
import { TeamMemberDetailsComponent } from './team-member-details/team-member-details.component';
import { TeamMembersComponent } from './team-members/team-members.component';



@NgModule({
  declarations: [
    AddTeamMemberComponent,
    TeamMemberDetailsComponent,
    TeamMembersComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    TeamMembersRoutingModule,
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
    MatTabsModule,
    MatCheckboxModule
  ]
})
export class TeamMembersModule { }
