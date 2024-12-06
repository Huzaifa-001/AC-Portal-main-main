import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateJobDto } from '../CreateJobsDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createWorkflowDto } from '../createWorkflowDto';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-add-workflow',
  templateUrl: './add-workflow.component.html',
  styleUrls: ['./add-workflow.component.css']
})
export class AddWorkflowComponent {
  public model: any = {};
  public modelMain: any = {};
  updateData: any = {};
  Jobs: any[] = [];
  workFlowForm!: FormGroup;
  workFlowDto?: createWorkflowDto;

  constructor(private dialogRef: MatDialogRef<AddWorkflowComponent>, private jobService: JobService, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);
    }
  }

  ngOnInit(): void {
    this.workFlowForm = this.formBuilder.group({
      name: [''],
      description: [''],
      job: ['']
    });

    Promise.all([
      this.getAllJobs()
    ]).then(() => {

    })
  }

  getAllJobs()
  {
    this.jobService.getAllJobsByCompanyID().subscribe(
      res => {
        this.Jobs = res.map((job: { id: number, name: string }) => {
          return {id: job.id, name: job.name}
        })
      },
      err => {
        console.log(err);
      },
      () => {
       
      }
    );
  }

  closeAddJobsModal() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.workFlowForm.markAllAsTouched();
    if (this.workFlowForm.valid) {
      this.workFlowDto = this.workFlowForm.value;
      this.jobService.createWorkflow(this.workFlowForm.value).subscribe(
        res => {
          this.snackBar.open('Record inserted successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/jobs']);
          this.dialogRef.close();
        },
        err => {
          console.log(err);
          this.snackBar.open('Error', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      )
    }
  }
}
