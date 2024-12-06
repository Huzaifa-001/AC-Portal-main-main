import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AddcontactComponent } from '../../contact/addcontact/addcontact.component';
import { ProjectService } from 'src/app/core/services/project.service';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  public toggle: boolean = false;
  public rgbaText: string = 'rgba(165, 26, 214, 0.2)';
  public arrayColors: any = {
    color1: '#2883e9',
  };
  showprojectColor = false
  public projectColor: string = '#a897b7';
  public background: string = '#b596b6';
  public selectedColor: string = 'color1';

  private subscriptions: Subscription = new Subscription();
  projectForm!: FormGroup;
  updateData: any;
  relatedcontacts: any;
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AddcontactComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public contactService: ContactService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
  ) {
    if (data) {
      this.updateData = data;
    }
  }

  get ssForm() {
    return this.projectForm.controls;
  }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      id: new FormControl(''),
      projectName: new FormControl(''),
      projectType: new FormControl(''),
      projectColor: new FormControl('#a897b7'),
      background: new FormControl('#b596b6'),
      accessUserID: new FormControl(''),
    });

    Promise.all([
      this.getRelatedcontacts(),
    ])
      .then(() => {
        console.log(this.updateData);
        // All asynchronous functions have completed
        if (this.updateData && this.updateData?.id) {
          // Patch Value Here
          this.projectColor = this.updateData.projectColor
          this.background = this.updateData.background
          this.projectForm.patchValue(this.updateData)
        }
      })
      .catch((error) => {
        console.error('An error occurred while fetching data:', error);
      });
  }

  closeDailog() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.projectForm.value)
    this.projectForm.markAllAsTouched();
    if (this.projectForm.valid && !this.updateData?.id) {
      this.subscriptions.add(
        this.projectService
          .createProject(
            this.projectForm.value
          )
          .subscribe({
            next: (res) => {
              this.snackBar.open('Record inserted successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['/projects']);
              this.dialogRef.close();
            },
            error: (err) => {
              console.log(err);
              this.snackBar.open('Error', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            },
            complete: () => {
              // This block will be executed when the observable completes
            },
          })
      );
    } else {
      this.subscriptions.add(
        this.projectService
          .updateProject(
            this.projectForm.value
          )
          .subscribe({
            next: (res) => {
              this.snackBar.open('Record updated successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.router.navigate(['/projects']);
              this.dialogRef.close();
            },
            error: (err) => {
              console.log(err);
              this.snackBar.open('Error', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            },
            complete: () => {
              // This block will be executed when the observable completes
            },
          })
      );
    }
  }


  getRelatedcontacts() {
    this.subscriptions.add(
      this.contactService.getRelatedContactsDropDown().subscribe({
        next: (res) => {
          this.relatedcontacts = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  ngOnDestroy() {
    //Unsubscribe All subscriptions
    this.subscriptions.unsubscribe();
  }
}

