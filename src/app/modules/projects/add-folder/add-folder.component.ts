import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.css']
})
export class AddFolderComponent {
  public toggle: boolean = false;
  public rgbaText: string = 'rgba(165, 26, 214, 0.2)';
  public folderColor: string = '#a897b7';
  foldersForm!: FormGroup;
  updateData: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private toastr : ToastrService,
    public dialogRef: MatDialogRef<AddFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
  ) {
    debugger
    if (data) {
      this.updateData = data;
    }
  }

  ngOnInit(): void {
    this.foldersForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('',Validators.required),
      color: new FormControl('#a897b7'),
      parentFolderId: new FormControl(0),
    });
  }

  closeDailog() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.foldersForm.value)
    this.foldersForm.markAllAsTouched();
    var data = {
      id: this.updateData.id ?? 0,
      name: this.foldersForm.value.name,
      color: this.folderColor,
      parentFolderId: this.updateData.parentFolderId ?? 0,
    }
    if (this.foldersForm.valid && !this.updateData?.id) {
      this.subscriptions.add(
        this.projectService
          .createFolder(
            data
          )
          .subscribe({
            next: (res) => {
              this.toastr.success('Folder Created Successfully');
              this.dialogRef.close();
            },
            error: (err) => {
              console.log(err);
              this.toastr.error('Error Occurred While Creating Folder');
            }
          })
      );
    } else {
      this.subscriptions.add(
        this.projectService
          .updateFolder(
            data
          )
          .subscribe({
            next: (res) => {
              this.toastr.success('Folder Updated Successfully');
              this.dialogRef.close();
            },
            error: (err) => {
              console.log(err);
              this.toastr.error('Error Occurred While Updating Folder');
            }
          })
      );
    }
  }

  ngOnDestroy() {
    //Unsubscribe All subscriptions
    this.subscriptions.unsubscribe();
  }
}
