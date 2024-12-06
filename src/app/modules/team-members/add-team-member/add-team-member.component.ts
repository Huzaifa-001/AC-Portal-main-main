import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamMemberCreateRequestDto } from 'src/app/core/interfaces';
import { passwordStrengthValidator } from 'src/app/core/rootservices/passwordStrengthValidator';
import { ContactService } from 'src/app/core/services/contact.service';
import { OfficeLocationService } from 'src/app/core/services/OfficeLocation/office-location.service';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.css']
})
export class AddTeamMemberComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  teamMemberForm!: FormGroup;
  updateData: any = {};
  officeLocations: any[] = [];
  states: any[] = [];
  timeZones: any[] = [];

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AddTeamMemberComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public contactService: ContactService,
    public officeLocationService: OfficeLocationService,
  ) { }

  get ssForm() {
    return this.teamMemberForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
  }

  private initializeForm(): void {
    this.teamMemberForm = this.formBuilder.group({
      id: [0], // Optional, used for update scenarios
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
      isSubContractor: [false],
      accountColor: [''],
      pictureUrl: [''],
      enableLogin: [true],
      state: ['', Validators.required],
      isTeamMember: [true],
      timeZone: ['', Validators.required],
      businessLocation: ['', Validators.required],
      // addressLine1: [''],
      // addressLine2: ['']
    });
  }

  private loadInitialData(): void {
    this.subscriptions.add(
      this.contactService.allOfficeLocations().subscribe({
        next: (res) => {
          this.officeLocations = res.payload;
        },
        error: (err) => {
          console.error('Error fetching office locations:', err);
        }
      })
    );

    this.subscriptions.add(
      this.contactService.allState().subscribe({
        next: (res) => {
          this.states = res.payload;
        },
        error: (err) => {
          console.error('Error fetching states:', err);
        }
      })
    );

    this.subscriptions.add(
      this.officeLocationService.getTimeZones().subscribe(
        (timeZonesRes) => {
          this.timeZones = timeZonesRes.payload;
        },
        (error) => {
          console.error('Error fetching time zones:', error);
        }
      )
    )

    if (this.data && this.data?.id) {
      this.updateData = this.data;
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    this.teamMemberForm.patchValue({
      id: this.updateData?.id || '',
      firstName: this.updateData?.firstName || '',
      lastName: this.updateData?.lastName || '',
      email: this.updateData?.email || '',
      password: '', // Note: Do not set existing password, handle it securely
      isSubContractor: this.updateData?.isSubContractor || false,
      accountColor: this.updateData?.accountColor || '',
      pictureUrl: this.updateData?.pictureUrl || '',
      enableLogin: this.updateData?.enableLogin || true,
      state: this.updateData?.state || '',
      isTeamMember: this.updateData?.isTeamMember || true,
      timeZone: this.updateData?.timeZone || '',
      businessLocation: this.updateData?.businessLocation || '',
      // addressLine1: this.updateData?.addressLine1 || '',
      // addressLine2: this.updateData?.addressLine2 || ''
    });
    // Disable the password field in case of an update
    this.teamMemberForm.controls['password'].disable();

    // Remove the 'required' validator from the password field
    this.teamMemberForm.controls['password'].clearValidators();
    this.teamMemberForm.controls['password'].updateValueAndValidity();
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.teamMemberForm.markAllAsTouched();
    if (this.teamMemberForm.valid) {
      const teamMemberData: TeamMemberCreateRequestDto = this.teamMemberForm.value;

      if (this.updateData?.id) {
        this.subscriptions.add(
          this.contactService.updateTeamMembers(teamMemberData).subscribe({
            next: (res) => {
              this.snackBar.open('Record updated successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['/team-members']);
              this.dialogRef.close();
            },
            error: (err) => {
              console.error('Error updating record:', err);
              this.snackBar.open('Error updating record', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            }
          })
        );
      } else {
        this.subscriptions.add(
          this.contactService.addTeamMembers(teamMemberData).subscribe({
            next: (res) => {
              this.snackBar.open('Record inserted successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['/team-members']);
              this.dialogRef.close();
            },
            error: (err) => {
              console.error('Error inserting record:', err);
              this.snackBar.open('Error inserting record', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            }
          })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
