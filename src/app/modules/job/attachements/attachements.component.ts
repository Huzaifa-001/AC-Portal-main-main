import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { AppConfig } from 'src/app/core/app-config';
import { JobService } from 'src/app/core/services/job.service';
import { saveAs } from 'file-saver';
import { DynamicField, EntityTypes, FieldTypes } from '../../custom-fields/common';
import { FieldService } from 'src/app/core/services/field.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attachements',
  templateUrl: './attachements.component.html',
  styleUrls: ['./attachements.component.css']
})
export class AttachementsComponent {
  jobId: any;
  attachments: any[] = [];
  selectedFiles = []
  selectedAttachments: any = [];
  isAllSelected = false
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private JobService: JobService,
    private formBuilder: FormBuilder,
    private cRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private http: HttpClient,
    private fieldService: FieldService,
  ) {
    this.fieldsValueForm = this.formBuilder.group({});
    this.jobId = this.route.parent.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadPagedData(this.currentPageIndex);
  }

  currentPageIndex: any = 1;
  totalCount: number = 0;
  pageSize: number = AppConfig.pageSize;

  loadPagedData(pageIndex: number) {
    this.JobService.getJobAttachmentsByJobId(this.jobId).subscribe((res) => {
      this.attachments = []
      this.attachments = res.data
      this.attachments.forEach(attachment => attachment.isSelected = false);
      // this.totalCount = Math.ceil(res.count / res.pageSize) ?? res.length;
      this.totalCount = res.length;
      this.currentPageIndex = res.pageIndex ?? 1;
      this.cRef.detectChanges()
    });
  }


  fields: DynamicField[] = []
  fieldsValueForm: FormGroup<{}>;
  existingCustomFieldsValues: any;
  // handleCustomFields() {
  // this.fieldService.getFieldsByEntityType(EntityTypes.Attachment).subscribe({
  //     next: (res) => {
  //       this.fields = res
  //       if (this.attachments.length > 0) {
  //         this.existingCustomFieldsValues = this.updateData.customFieldValues;
  //         this.fields.forEach(field => {
  //           const validators = field.isRequired ? [Validators.required] : [];
  //           const existingFieldValue = this.existingCustomFieldsValues.find(value => value.fieldDefinitionId === field.id)?.fieldValue;
  //           let existingValue: any = '';
  //           if (existingFieldValue) {
  //             try {
  //               existingValue = JSON.parse(existingFieldValue);
  //             } catch (e) {
  //               console.error(`Error parsing field value for field ${field.id}:`, e);
  //               existingValue = '';
  //             }
  //           }
  //           if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
  //             const valueArray = Array.isArray(existingValue) ? existingValue : []; // Ensure it's an array
  //             this.fieldsValueForm.addControl(field.id.toString(), new FormControl(valueArray, validators));
  //           } else {
  //             this.fieldsValueForm.addControl(field.id.toString(), new FormControl(existingValue, validators));
  //           }
  //         });
  //       }
  //       else {
  //         this.fields.forEach(field => {
  //           const validators = field.isRequired ? [Validators.required] : [];
  //           if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
  //             this.fieldsValueForm.addControl(field.id.toString(), new FormControl([], validators));
  //           } else {
  //             this.fieldsValueForm.addControl(field.id.toString(), new FormControl('', validators));
  //           }
  //         });
  //       }


  //     }
  //   })
  // }


  onFileSelected(event: any) {
    debugger
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const formData = new FormData();
          formData.append('JobId', this.jobId);
          formData.append('Description', "");
          formData.append('File', file);

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
        reader.readAsDataURL(file);
      }

    }
  }


  deleteJobClick(data: any): void {
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
        this.JobService.deleteJobAttachment(data.id).subscribe({
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
