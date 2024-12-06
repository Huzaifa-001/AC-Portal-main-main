import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { CsvExportService } from 'src/app/core/rootservices/csv-export-service.service';
import { OfficeLocationService } from 'src/app/core/services/OfficeLocation/office-location.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { LocationService } from 'src/app/core/services/location.service';
import { AddcontactComponent } from 'src/app/modules/contact/addcontact/addcontact.component';
import { PagedOfficeLocationsDTO } from '../DTOs/PagedOfficeLocationsDTO';
import { OfficeLocationDTO, PagedOfficeLocationsResponseDTO } from '../DTOs/PagedOfficeLocationsResponseDTO';
import { AddOfficeLocationComponent } from '../add-office-location/add-office-location.component';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {


  officeForm: FormGroup;
  fb: FormBuilder

  pagedOfficeLocations: OfficeLocationDTO[] = [];
  currentPageIndex: number = 1;
  pageSize: number = AppConfig.pageSize;
  totalCount: number = 0;

  constructor(private officeLocationService: OfficeLocationService, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.loadPagedOfficeLocations(this.currentPageIndex);
  }

  initForm() {
    this.officeForm = this.fb.group({
      officeLocationName: ['', Validators.required],
      color: ['', Validators.required],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      zipCode: [''],
      phoneNumber: [''],
      logoUrl: [''],
      stateId: [''],
      timeZoneId: [''],
    });
  }

  onSubmit() {
    if (this.officeForm.valid) {
      const officeData = this.officeForm.value;
      this.officeLocationService.createOfficeLocation(officeData).subscribe(
        (response) => {
          console.log('Office created successfully', response);
          // Reset form or perform other actions
        },
        (error) => {
          console.error('Error creating office', error);
        }
      );
    }
  }

  loadPagedOfficeLocations(pageIndex: number) {
    const dto: PagedOfficeLocationsDTO = {
      pageIndex: pageIndex,
      pageSize: this.pageSize,
    };

    this.officeLocationService.getPagedOfficeLocations(dto).subscribe(
      (response: PagedOfficeLocationsResponseDTO) => {
        this.pagedOfficeLocations = response.payload;
        this.currentPageIndex = response.pageIndex;
        this.totalCount = Math.ceil(response.count / response.pageSize);
      },
      (error) => {
        console.error('Error loading paged office locations', error);
      }
    );
  }

  onPageChange(newPageIndex: number) {
    this.loadPagedOfficeLocations(newPageIndex);
  }


  redirect(contact: any) {
    this.router.navigate(['/contact', contact.id], {
      state: { model: contact },
    });
  }

  openAddOfficeLocationModal(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Add Office Location';
      data.Request_Type = 'Add';
      dialogRef = this.dialog.open(AddOfficeLocationComponent, {
        width: '70vw',
        height: '640px',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Edit Office Location';
      data.Request_Type = 'Save';
      dialogRef = this.dialog.open(AddOfficeLocationComponent, {
        width: '70vw',
        height: '640px',
        data: data,
        disableClose: true,
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadPagedOfficeLocations(this.currentPageIndex);
    });
  }

  getTotalPages(): number[] {
    return Array.from({ length: this.totalCount }, (_, index) => index + 1);
  }

  deleteOfficeLocation(data: any) { }
  searchText = ""
  sortField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
