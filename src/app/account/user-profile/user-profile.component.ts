import { Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { JobDTO, WorkFlowType } from 'src/app/core/interfaces';
import { OfficeLocationService } from 'src/app/core/services/OfficeLocation/office-location.service';
import { AccountService } from 'src/app/core/services/account.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { JobService } from 'src/app/core/services/job.service';
import { UtilityService } from 'src/app/core/services/shared/UtilityService';
import { WorkflowService } from 'src/app/core/workflow.service';
import { CreatePhoneNumbersDto } from 'src/app/modules/contact/CreatePhoneNumbersDto';
import { CreateJobDto } from 'src/app/modules/job/CreateJobsDto';
import { AddJobsComponent } from 'src/app/modules/job/add-jobs/add-jobs.component';
import { PagedOfficeLocationsDTO } from 'src/app/modules/location/DTOs/PagedOfficeLocationsDTO';
import * as _ from 'lodash';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  UserProfile: FormGroup;
  notificationMethods: any[] = []; // You can initialize this array based on your needs
  states: any[] = []; // Assuming you have a states array
  locations: any[] = []; // Assuming you have a locations array
  timeZones: any[] = []; // Assuming you have a timeZones array
  permissions: any[] = []; // Assuming you have a permissions array
  private subscriptions: Subscription = new Subscription();
  imagePath: any = 'assets/images/5.png'; // initialize with a default image
  @ViewChild('profileImgInput') profileImgInput: any;
  modelMain: any;
  updateData: any;
  accountColors: { name: string; code: string; }[];
  changePasswordForm: FormGroup;
  currentLoggedInUser: any;
  UsersProfile: any;
  tempNotificationMethods: any;


  constructor(
    private dialogRef: MatDialogRef<AddJobsComponent>,
    private jobService: JobService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService,
    private workFlowService: WorkflowService,
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AccountService,
    private officeLocationService: OfficeLocationService
  ) {
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);
    }
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadStates();
    this.loadLocations();
    this.loadTimeZones();
    this.loadPermissions();
    this.loadUserProfileData();
    this.currentLoggedInUser = this.authService.getUser();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePath = reader.result;
        // Update the value of the 'file' form control
        this.UserProfile.patchValue({ file: file });
      };
      reader.readAsDataURL(file);
    }
  }


  initializeForm(): void {
    this.UserProfile = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      stateId: new FormControl(''),
      location: new FormControl(''),
      timeZone: new FormControl(''),
      permission: new FormControl(''),
      accountColor: new FormControl(''),
      subcontractor: new FormControl(''),
      file: new FormControl(this.imagePath)
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.changePasswordForm.get('confirmPassword').setValidators([Validators.required, Validators.minLength(6), this.passwordsMatchValidator.bind(this)]);

  }

  loadStates(): void {
    this.officeLocationService.getStates().subscribe(
      (statesResponse) => {
        this.states = statesResponse.payload;
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }

  loadLocations(): void {
    this.officeLocationService.getAllOfficeLocations().subscribe(
      (locationsRes) => {
        this.locations = locationsRes?.payload ?? [];
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }

  loadTimeZones(): void {
    this.officeLocationService.getTimeZones().subscribe(
      (timeZonesRes) => {
        this.timeZones = timeZonesRes.payload;
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }

  loadPermissions(): void {
    this.authService.getPermissions().subscribe(
      (permissionsRes) => {
        this.permissions = permissionsRes.payload;
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }


  loadUserProfileData(): void {
    this.authService.getNotificationSettings().subscribe(
      (res) => {
        this.notificationMethods = res.payload ?? [];
        this.tempNotificationMethods = _.cloneDeep(this.notificationMethods)
      });
    this.authService.getUserProfile().subscribe(
      (res) => {
        this.UsersProfile = res.payload;
        const userProfileForForm = {
          firstName: this.UsersProfile.firstName,
          lastName: this.UsersProfile.lastName,
          mobileNumber: this.UsersProfile.mobile,
          email: this.UsersProfile.userName,
          stateId: this.UsersProfile.state,
          location: this.UsersProfile.businessLocation,
          timeZone: this.UsersProfile.timeZone,
          permission: this.UsersProfile.permission ?? 0, // Adjust accordingly
          accountColor: this.UsersProfile.accountColor,
          subcontractor: this.UsersProfile.isSubContractor, // Adjust accordingly
          file: this.UsersProfile.pictureUrl
        };
        this.imagePath = this.UsersProfile.pictureUrl
        this.UserProfile.patchValue(userProfileForForm)
        console.log(this.UsersProfile)
        console.log(this.UserProfile.value)
      },
      (error) => {
        console.error('Error fetching Notification Methods:', error);
      }
    );

    this.accountColors = [
      { name: 'Red', code: '#FF0000' },
      { name: 'Blue', code: '#0000FF' },
      { name: 'Green', code: '#00FF00' },
      { name: 'Yellow', code: '#FFFF00' },
      { name: 'Other', code: '#808080' },
    ];

  }


  onSubmit(): void {
    if (this.UserProfile.valid) {
      const formData = new FormData();
      const appendIfValid = (key: string, value: any) => {
        if (value !== null && value !== undefined && value.trim?.() !== "") {
          formData.append(key, value);
        }
      };
      appendIfValid('FirstName', this.UserProfile.get('firstName').value);
      appendIfValid('LastName', this.UserProfile.get('lastName').value);
      appendIfValid('Email', this.UserProfile.get('email').value);
      appendIfValid('Mobile', this.UserProfile.get('mobileNumber')?.value);
      appendIfValid('TimeZone', this.UserProfile.get('timeZone')?.value);
      appendIfValid('State', this.UserProfile.get('stateId')?.value);
      appendIfValid('IsSubContractor', this.UserProfile.get('subcontractor')?.value);
      appendIfValid('BusinessLocation', this.UserProfile.get('location')?.value);
      appendIfValid('AccountColor', this.UserProfile.get('accountColor')?.value);
      formData.append('Permission', this.UserProfile.get('permission')?.value ?? 0);
      const fileInput = this.UserProfile.get('file');
      if (fileInput && fileInput.value) {
        formData.append('file', fileInput.value);
      }
      this.authService.updateProfile(formData).subscribe(
        response => {
          const currentPhotoUrl = this.authService.getUser().photoUrl;
          const updatedUser = response.payload
          if (currentPhotoUrl !== updatedUser.photoUrl) {
            this.authService.updatePhotoUrl(updatedUser.photoUrl);
          }
          this.toastr.success("Profile updated successfully", 'Success');
        }
      );
    }
  }

  updateNotificationSettings() {
    var notUpdated = _.isEqual(this.notificationMethods, this.tempNotificationMethods)
    if (!notUpdated)
      this.authService.updateNotificationSettings(this.notificationMethods).subscribe(
        response => {
          console.log(JSON.stringify(response));
          this.tempNotificationMethods = _.cloneDeep(this.notificationMethods)
          this.toastr.success("Settings updated successfully", 'Success');
        }
      );
  }

  closeAddJobsModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Custom validator function
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.changePasswordForm.get('newPassword');
    const confirmPassword = this.changePasswordForm.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    return password.value === confirmPassword.value ? null : { mismatch: true };
  }


  changePassordSubmit() {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.get('confirmPassword').value;
      var payload = {
        email: this.authService.getUserName(),
        oldPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.confirmPassword
      }
      this.authService.changePassword(payload).subscribe(
        (response: any) => {
          this.toastr.success("Password changed successfully", 'Success');
        },
        error => {
          this.toastr.error('Something went wrong.\nCheck your current password and try again!', 'Error');
        }
      );
    }
  }
}