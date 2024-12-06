import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationsListComponent } from './automations-list/automations-list.component';
import { AutomationsRoutingModule } from './automations-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
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
import { AddAutomationComponent } from './add-automation/add-automation.component';
import { CoreModule } from 'src/app/core/core.module';
import { AutoActionComponent } from './auto-action/auto-action.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeFieldComponent } from './ModalComponents/change-field/change-field.component';
import { SendTextMessageComponent } from './ModalComponents/send-text-message/send-text-message.component';
import { SendEmailComponent } from './ModalComponents/send-email/send-email.component';
import { CallWebhookComponent } from './ModalComponents/call-webhook/call-webhook.component';
import { CreateTaskComponent } from './ModalComponents/create-task/create-task.component';
import { CreateWorkOrderComponent } from './ModalComponents/create-work-order/create-work-order.component';



@NgModule({
    declarations: [
        AutomationsListComponent,
        AddAutomationComponent,
        AutoActionComponent,
        ChangeFieldComponent,
        SendTextMessageComponent,
        SendEmailComponent,
        CallWebhookComponent,
        CreateTaskComponent,
        CreateWorkOrderComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        AutomationsRoutingModule,
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
export class AutomationsModule { }
