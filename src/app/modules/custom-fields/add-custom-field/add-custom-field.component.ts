import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { DynamicField, EntityTypes, FieldTypes, Option } from '../common';
import { FieldService } from 'src/app/core/services/field.service';

@Component({
  selector: 'app-add-custom-field',
  templateUrl: './add-custom-field.component.html',
  styleUrls: ['./add-custom-field.component.css']
})
export class AddCustomFieldComponent implements OnInit, OnDestroy {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA];
  dynamicFieldForm: FormGroup;
  updateData: DynamicField;
  private subscriptions: Subscription = new Subscription();
  entityTypes = Object.values(EntityTypes);
  fieldTypes = Object.values(FieldTypes);

  constructor(
    private dialogRef: MatDialogRef<AddCustomFieldComponent>,
    private fb: FormBuilder,
    private fieldService: FieldService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dynamicFieldForm = this.fb.group({
      id: [0],
      entityType: ['', Validators.required],
      fieldName: ['', Validators.required],
      fieldType: ['', Validators.required],
      isRequired: [false],
      multiSelect: [false],
      options: this.fb.array([])
    });

    if (data) {
      this.options.clear()
      this.updateData = Object.assign({}, data);
      this.dynamicFieldForm.patchValue(this.updateData);
      if (this.updateData.options) {
        this.updateData.options.forEach(option => {
          this.options.push(this.createOption(option));
        });
      }
    }
  }

  ngOnInit(): void {
    if (this.updateData && this.updateData.id) {
      this.fieldService.getFieldById(this.updateData.id.toString()).subscribe(
        (field: DynamicField) => {
          this.updateData = field;
          this.dynamicFieldForm.patchValue(this.updateData);
          this.options.clear()
          if (this.updateData.options) {
            this.updateData.options.forEach(option => {
              this.options.push(this.createOption(option));
            });
          }
        },
        (err) => {
          console.error(err);
        }
      );
    }

    //this.dynamicFieldForm.get("entityType").disable();
  }

  get options(): FormArray {
    return this.dynamicFieldForm.get('options') as FormArray;
  }

  createOption(option: Option): FormGroup {
    return this.fb.group({
      id: [option.id],
      value: [option.value, Validators.required]
    });
  }

  addOption(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.options.push(this.createOption({ id: 0, value: value.trim() }));
    }

    if (input) {
      input.value = '';
    }
  }

  removeOption(option: Option): void {
    const index = this.options.controls.findIndex(ctrl => ctrl.value === option);

    if (index >= 0) {
      this.options.removeAt(index);
    }
  }

  onSubmit(): void {
    this.dynamicFieldForm.markAllAsTouched();
    if (this.dynamicFieldForm.valid) {
      debugger
      const fieldData: DynamicField = this.dynamicFieldForm.value;
      if(fieldData.fieldType != 'dropdown') fieldData.options = null
      if (fieldData.id === 0) {
        // Create new field
        this.fieldService.createField(fieldData).subscribe(
          (res) => {
            this.snackBar.open('Record inserted successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.resetForm()
            this.dialogRef.close();
          },
          (err) => {
            console.error(err);
            this.snackBar.open('Error', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          },
          () => {
            this.resetForm()
            this.dialogRef.close(fieldData);
          }
        );
      } else {
        // Update existing field
        this.fieldService.updateField(fieldData).subscribe(
          (res) => {
            this.snackBar.open('Record updated successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.resetForm()
            this.dialogRef.close();
          },
          (err) => {
            console.error(err);
            this.snackBar.open('Error', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          },
          () => {
            this.resetForm()
            this.dialogRef.close(fieldData);
          }
        );
      }
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
    this.resetForm()
  }

  private resetForm(): void {
    this.dynamicFieldForm.reset({
      id: 0,
      entityType: '',
      fieldName: '',
      fieldType: '',
      isRequired: false,
      multiSelect: false,
      options: this.fb.array([])
    });
    this.options.clear();
  }

  ngOnDestroy() {
    this.resetForm()
    this.subscriptions.unsubscribe();
  }
}
