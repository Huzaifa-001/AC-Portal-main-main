import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityTypes } from '../common';
import { FieldService } from 'src/app/core/services/field.service';
import { AddCustomFieldComponent } from '../add-custom-field/add-custom-field.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-customfields',
  templateUrl: './customfields.component.html',
  styleUrls: ['./customfields.component.css']
})
export class CustomfieldsComponent {
  selectedTabIndex: number;
  public entityTypes = [
    EntityTypes.Contact,
    EntityTypes.Job,
    EntityTypes.WorkOrder,
    EntityTypes.Attachment,
    EntityTypes.Note,
    EntityTypes.Task,
    EntityTypes.Source
  ];

  public tabs = [
    { label: 'Contacts', route: EntityTypes.Contact },
    { label: 'Jobs', route: EntityTypes.Job },
    { label: 'Work Orders', route: EntityTypes.WorkOrder },
    { label: 'Tasks', route: EntityTypes.Task },
    // { label: 'Attachments', route: EntityTypes.Attachment },
    // { label: 'Notes', route: EntityTypes.Note },
    // { label: 'Sources', route: EntityTypes.Source }
  ];
  
  selectedTab: string;
  selectedTabLabel: { label: string; route: string; };
  fields: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute,private fieldService: FieldService,
    private dialog: MatDialog,
  ) {
    const routePath = this.route.snapshot.firstChild?.routeConfig?.path;
    this.updateSelectedTab(routePath)
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTab = this.entityTypes[event.index];
    this.selectedTabLabel = this.tabs.find(x => x.route == this.selectedTab)
    this.router.navigate(['settings/custom-fields/'+this.selectedTab]);
    this.selectedTabIndex = event.index;
    this.loadFields(this.selectedTab)
  }

  private updateSelectedTab(routePath: string) {
    const tabIndex = this.entityTypes.indexOf(routePath);
    this.selectedTabIndex = tabIndex !== -1 ? tabIndex : 0;
    this.selectedTab = this.entityTypes[this.selectedTabIndex];
    this.selectedTabLabel = this.tabs.find(x => x.route == this.selectedTab)
    this.loadFields(this.selectedTab)
  }

  private loadFields(entityType: string) {

    this.fieldService.getFieldsByEntityType(entityType).subscribe(
      (data: any[]) => {
        this.fields = data;
        this.selectedTabLabel = this.tabs.find(tab => tab.route === entityType) || this.tabs[0];
      },
      error => {
        console.error('Error fetching fields', error);
      }
    );
  }


  openAddCustomFieldModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {}
      data.FormTitle = `Add ${this.selectedTabLabel.label} Custom Field`;
      data.Request_Type = 'Add';
      data.entityType = this.selectedTab
      dialogRef = this.dialog.open(AddCustomFieldComponent, {
        width: '50vw',
        maxHeight: '90vh',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = `Edit ${this.selectedTabLabel.label} Custom Field`;
      data.Request_Type = 'Save';
      data.entityType = this.selectedTab

      dialogRef = this.dialog.open(AddCustomFieldComponent, {
        width: '50vw',
        maxHeight: '90vh',
        data: data,
        disableClose: true,
      });
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadFields(this.selectedTab)
    });
  }

  deleteField(field: any) {
    let dialogRef: any = {};
    field.FormTitle = 'Confirm Delete';
    field.Request_Type = 'Delete';
    dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: field,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      debugger
      if (result) {
        this.fieldService.deleteField(field.id).subscribe({
          next: (res) => {
            console.log(res);
            this.loadFields(this.selectedTab)

          },
          error: (res) => {
            console.log(res);
          },
        });
      }
    });
  }
  
  searchText = ""
  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
