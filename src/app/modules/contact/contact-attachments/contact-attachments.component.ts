import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { AppConfig } from 'src/app/core/app-config';
import { JobService } from 'src/app/core/services/job.service';
import { saveAs } from 'file-saver';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contact-attachments',
  templateUrl: './contact-attachments.component.html',
  styleUrls: ['./contact-attachments.component.css']
})
export class ContactAttachmentsComponent {
  contactId: any;
  attachments: any[] = [];
  selectedFiles = []
  selectedAttachments: any = [];
  isAllSelected = false
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private contactService: ContactService,
    private cRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.contactId = this.route.parent.snapshot.paramMap.get('id');

  }

  ngOnInit() {
    this.loadPagedData(this.currentPageIndex);
  }
  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  loadPagedData(pageIndex: number) {
    this.contactService.getContactAttachmentsByContactId(this.contactId).subscribe((res) => {
      this.attachments = []
      this.attachments = res.data
      this.attachments.forEach(attachment => attachment.isSelected = false);
      // this.totalCount = Math.ceil(res.count / res.pageSize) ?? res.length;
      this.totalCount = res.length;
      this.currentPageIndex = res.pageIndex ?? 1;
      this.cRef.detectChanges()
    });
  }


  onFileSelected(event: any) {
    debugger
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const formData = new FormData();
          formData.append('ContactId', this.contactId);
          formData.append('Description', "");
          formData.append('File', file);

          this.contactService.createContactAttachment(formData).subscribe(
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
        reader.readAsDataURL(file);
      }

    }
  }


  deleteContactClick(data: any): void {
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
        this.contactService.deleteContactAttachment(data.id).subscribe({
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
        this.attachments.forEach(attachment => attachment.isSelected = false);
      }
    );
  }
  


  selectAll(event: any): void {
    this.isAllSelected = event.target.checked;
    this.attachments.forEach(attachment => attachment.isSelected = event.target.checked);
    this.updateSelectedAttachments();
  }

  updateSelected(attachment: any): void {
    this.updateSelectedAttachments();
  }

  updateSelectedAttachments(): void {
    this.selectedAttachments = this.attachments.filter(attachment => attachment.isSelected);

  }


}
