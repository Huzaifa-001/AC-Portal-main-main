import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-add-contact-photo',
  templateUrl: './add-contact-photo.component.html',
  styleUrls: ['./add-contact-photo.component.css']
})
export class AddContactPhotoComponent {
  selectedFiles: any[] = [];
  existingImageUrl: any;
  contactId: string;
  photosForm: any;
  modelMain: any;
  updateData: any;
  constructor(
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddContactPhotoComponent>,
    private contactService: ContactService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    debugger
    if (data) {
      this.modelMain = data;
      this.updateData = Object.assign({}, this.modelMain);
      this.contactId = this.updateData.contactId;
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
    formData.append('ContactId', this.contactId);
    formData.append('Description', this.photosForm.value.description);
    this.existingImageUrl

    if (this.updateData.id && this.updateData != 0) {
      this.contactService.updateContactPhoto(formData).subscribe(
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
      this.contactService.addContactPhoto(formData).subscribe(
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
