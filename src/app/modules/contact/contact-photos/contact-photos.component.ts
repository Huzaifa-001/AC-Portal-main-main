import { ChangeDetectorRef, Component } from '@angular/core';
import { AppConfig } from 'src/app/core/app-config';
import { AddJobPhotoComponent } from '../../job/add-job-photo/add-job-photo.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobService } from 'src/app/core/services/job.service';
import { saveAs } from 'file-saver';
import { ContactService } from 'src/app/core/services/contact.service';
import { AddContactPhotoComponent } from '../add-contact-photo/add-contact-photo.component';

@Component({
  selector: 'app-contact-photos',
  templateUrl: './contact-photos.component.html',
  styleUrls: ['./contact-photos.component.css']
})
export class ContactPhotosComponent {
  contactId: any;
  photos: any;
  selectedFiles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private contactService: ContactService,
    private cRef: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    this.contactId = this.route.parent.snapshot.paramMap.get('id');

  }

  ngOnInit() {
    this.loadPagedData(1);
  }
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  loadPagedData(pageIndex: number) {
    this.contactService.getPhotosByContactId(this.contactId).subscribe((res) => {
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
        this.contactService.deleteContactPhoto(data.id).subscribe({
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
    this.contactService.downloadFiles(fileNames).subscribe(
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



  addNewContactPhoto(data: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.contactId = this.contactId
      data.FormTitle = "Add Photo";
      data.Request_Type = "Add";
      dialogRef = this.dialog.open(AddContactPhotoComponent, {
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
      data.contactId = this.contactId
      data.FormTitle = "Update Photo";
      data.Request_Type = "Update";
      dialogRef = this.dialog.open(AddContactPhotoComponent, {
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
    formData.append('contactId', this.contactId);
    formData.append('Description', "");
    formData.append('File', this.selectedFiles[0]);

    this.contactService.addContactPhoto(formData).subscribe(
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