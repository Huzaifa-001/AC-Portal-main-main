import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfficeLocationService } from 'src/app/core/services/OfficeLocation/office-location.service';
import { CreateOfficeLocationDTO } from '../DTOs/CreateOfficeLocationDTO';
import { UpdateOfficeLocationDTO } from '../DTOs/UpdateOfficeLocationDTO';

@Component({
  selector: 'app-add-office-location',
  templateUrl: './add-office-location.component.html',
  styleUrls: ['./add-office-location.component.css']
})
export class AddOfficeLocationComponent {
  // Sample timeZones data
  sampleTimeZones = [
    { id: 1, name: 'UTC' },
    { id: 2, name: 'GMT' },
    { id: 3, name: 'PST' },
    // ... Add more time zones
  ];

  // Sample states data
  sampleStates = [
    { id: 1, name: 'California' },
    { id: 2, name: 'New York' },
    { id: 3, name: 'Texas' },
    // ... Add more states
  ];
  timeZones: any[];
  states: any[];

  AddOfficeLocationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddOfficeLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private officeLocationService: OfficeLocationService // Inject the service
  ) {
    this.AddOfficeLocationForm = new FormGroup({
      officeLocationName: new FormControl('', [Validators.required]),
      color: new FormControl(''),
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl(0),
      phoneNumber: new FormControl(''),
      logoUrl: new FormControl(''),
      stateId: new FormControl(0),
      timeZoneId: new FormControl(0, [Validators.required]),
    });
  }

  ngOnInit(): void {


    // Fetch time zones
    this.officeLocationService.getTimeZones().subscribe(
      (timeZonesResponse) => {
        this.timeZones = timeZonesResponse.payload;
      },
      (error) => {
        console.error('Error fetching time zones:', error);
      }
    );

    // Fetch states
    this.officeLocationService.getStates().subscribe(
      (statesResponse) => {
        this.states = statesResponse.payload;
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );

    if (this.data) {
      this.AddOfficeLocationForm.patchValue(this.data);
    }
  }


  onSubmit(): void {
    if (this.AddOfficeLocationForm.valid) {
      const formValues = this.AddOfficeLocationForm.value;
      if (this.data.Request_Type === 'Add') {
        const createDto: CreateOfficeLocationDTO = {
          officeLocationName: formValues.officeLocationName,
          color: formValues.color,
          addressLine1: formValues.addressLine1,
          addressLine2: formValues.addressLine2,
          city: formValues.city,
          zipCode: formValues.zipCode,
          phoneNumber: formValues.phoneNumber,
          logoUrl: formValues.logoUrl,
          stateId: formValues.stateId,
          timeZoneId: formValues.timeZoneId
        };
        this.AddOfficeLocationForm.controls['timeZoneId'] as AbstractControl
        this.officeLocationService.createOfficeLocation(createDto).subscribe(
          (response) => {
            console.log('Office location created successfully:', response);
            // Close the modal after successful operation
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error creating office location:', error);
            // Handle error if needed
          }
        );
      } else if (this.data.Request_Type === 'Save') {
        const updateDto: UpdateOfficeLocationDTO = {
          id: this.data.id,
          officeLocationName: formValues.officeLocationName,
          color: formValues.color,
          addressLine1: formValues.addressLine1,
          addressLine2: formValues.addressLine2,
          city: formValues.city,
          zipCode: formValues.zipCode,
          phoneNumber: formValues.phoneNumber,
          logoUrl: formValues.logoUrl,
          stateId: formValues.stateId,
          timeZoneId: formValues.timeZoneId
        };
        this.officeLocationService.updateOfficeLocation(updateDto).subscribe(
          (response) => {
            console.log('Office location updated successfully:', response);
            // Close the modal after successful operation
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error updating office location:', error);
            // Handle error if needed
          }
        );
      }
    }
  }

  closeAddOfficeLocationModal() {
    this.dialogRef.close();
  }

  get control() : AbstractControl{
    return this.AddOfficeLocationForm.controls['timeZoneId'] as AbstractControl
  }
}
