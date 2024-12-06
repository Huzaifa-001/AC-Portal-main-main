import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { AppConfig } from 'src/app/core/app-config';
import { JobService } from 'src/app/core/services/job.service';
import { AddJobPhotoComponent } from '../add-job-photo/add-job-photo.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent {
  jobId: any;
  photos: any[] = [];
  selectedFiles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private JobService: JobService,
    private cRef: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    this.jobId = this.route.parent.snapshot.paramMap.get('id');

  }

  ngOnInit() {
    this.loadPagedData(1);
  }
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  loadPagedData(pageIndex: number) {
    this.JobService.getPhotosByJobId(this.jobId).subscribe((res) => {
      this.photos = []
      this.photos = res.data
      this.photos.forEach(attachment => attachment.isSelected = false);
      // this.totalCount = Math.ceil(res.count / res.pageSize) ?? res.length;
      this.totalCount = res.length;
      this.currentPageIndex = res.pageIndex ?? 1;
      this.cRef.detectChanges()
    });
  }


  onFileSelected(event: any) {
    this.selectedFiles = []
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedFiles.push(file);
        };
        reader.readAsDataURL(file);
      }
    }
  }


  deletePhotoClick(data: any): void {
    let dialogRef: any = {};
    data.FormTitle = 'Confirm Delete';
    data.Request_Type = 'Delete';
    dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '30vw',
      height: '200px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.JobService.deleteJobPhoto(data.id).subscribe({
          next: (res) => {
            this.toastr.success(res.message, 'Success');
          },
          error: (err) => {
            this.toastr.error(err.message, 'Error');
          }, complete: () => {
            this.loadPagedData(this.currentPageIndex);
          }
        });
      }
    });
  }

  downloadSelected(): void {
    const fileNames: string[] = this.selectedAttachments.map(attachment => attachment.fileName);
    console.log(fileNames);
    this.JobService.downloadFiles(fileNames).subscribe(
      (res: any) => {
        if (res instanceof Blob) {
          if (res.type === 'application/octet-stream') {
            saveAs(res, fileNames[0]); // Use the original file name
          } else {
            saveAs(res, 'downloadedFiles.zip');
          }
        } else {
          console.error('Invalid response content type:', typeof res);
        }
      },
      (error) => {
        console.error('Error downloading files:', error);
      },
      () => {
        this.photos.forEach(attachment => attachment.isSelected = false);
      }
    );
  }

  selectAll(event: any): void {
    this.isAllSelected = event.target.checked;
    this.photos.forEach(attachment => attachment.isSelected = event.target.checked);
    this.updateSelectedAttachments();
  }

  updateSelected(attachment: any): void {
    this.updateSelectedAttachments();
  }
  selectedAttachments: any = [];
  isAllSelected = false
  updateSelectedAttachments(): void {
    this.selectedAttachments = this.photos.filter(attachment => attachment.isSelected);

  }



  addNewJobPhoto(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.jobId = this.jobId
      data.FormTitle = "Add Photo";
      data.Request_Type = "Add";
      dialogRef = this.dialog.open(AddJobPhotoComponent, {
        width: '50vw',
        maxWidth: '90vw',
        height: 'auto',
        maxHeight: '90vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.loadPagedData(this.currentPageIndex);

      });
    }
    else {
      data = data;
      data.jobId = this.jobId
      data.FormTitle = "Update Photo";
      data.Request_Type = "Update";
      dialogRef = this.dialog.open(AddJobPhotoComponent, {
        width: '50vw',
        maxWidth: '90vw',
        height: 'auto',
        maxHeight: '90vh',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.loadPagedData(this.currentPageIndex);

      });
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('JobId', this.jobId);
    formData.append('Description', "");
    formData.append('File', this.selectedFiles[0]);

    this.JobService.createJobAttachment(formData).subscribe(
      {
        next: (res) => {
          this.toastr.success(res.message, 'Success');
        },
        error: (err) => {
          this.toastr.error(err.message, 'Error');
        }, complete: () => {
          this.loadPagedData(this.currentPageIndex);
        }
      }
    );
  };
}