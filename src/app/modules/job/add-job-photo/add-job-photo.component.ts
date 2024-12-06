import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-add-job-photo',
  templateUrl: './add-job-photo.component.html',
  styleUrls: ['./add-job-photo.component.css']
})
export class AddJobPhotoComponent {
  selectedFiles: any[] = [];
  jobId: string;
  photosForm: any;
  modelMain: any;
  updateData: any;
  existingImageUrl: any;
  constructor(
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddJobPhotoComponent>,
    private JobService: JobService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    debugger
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);
      this.jobId = this.updateData.jobId;
      this.existingImageUrl = this.updateData.fileUrl
    }
  }

  ngOnInit(): void {
    this.photosForm = new FormGroup({
      id: new FormControl(0),
      description: new FormControl('', [Validators.required])
    });

    if (this.updateData.id) {
      this.photosForm.patchValue(this.updateData)
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = []
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.existingImageUrl = reader.result as string;
          this.selectedFiles.push(file); // Push the file to the selectedFiles array
        };
        reader.readAsDataURL(file);
      }
    }
  }

  deSelectImage() {
    this.selectedFiles = []
    this.existingImageUrl = null
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('Id', this.photosForm.value.id ?? 0);
    formData.append('JobId', this.jobId);
    formData.append('Description', this.photosForm.value.description);
    this.existingImageUrl

    if (this.updateData.id && this.updateData != 0) {
      this.JobService.updateJobPhoto(formData).subscribe(
        {
          next: (res) => {
            this.closeDialog();
            this.toastr.success(res.message, 'Success');
          },
          error: (err) => {
            this.toastr.error(err.message, 'Error');
          }
        }
      );
    }
    else {
      formData.append('File', this.selectedFiles[0]);
      this.JobService.addJobPhoto(formData).subscribe(
        {
          next: (res) => {
            this.closeDialog();
            this.toastr.success(res.message, 'Success');
          },
          error: (err) => {
            this.toastr.error(err.message, 'Error');
          }
        }
      );
    }
  };

  closeDialog() {
    this.dialogRef.close();
  }
}
