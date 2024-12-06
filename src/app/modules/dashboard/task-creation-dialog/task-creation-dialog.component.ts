import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, forkJoin } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { DynamicField, EntityTypes, FieldTypes } from '../../custom-fields/common';
import { FieldService } from 'src/app/core/services/field.service';

@Component({
  selector: 'app-task-creation-dialog',
  templateUrl: './task-creation-dialog.component.html',
})
export class TaskCreationDialogComponent {
  taskForm: FormGroup;
  updateData: any
  modelMain: any;
  private subscriptions: Subscription = new Subscription();
  relatedContacts: any;
  Jobs: any;
  allSubcontractors: any;
  allTeamMembers: any;

  constructor(
    private dialogRef: MatDialogRef<TaskCreationDialogComponent>,
    private fb: FormBuilder,
    private jobService: JobService,
    private taskService: TasksService,
    private snackBar: MatSnackBar,
    private fieldService: FieldService,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.fieldsValueForm = this.fb.group({});

    this.taskForm = new FormGroup({
      id: new FormControl(null),
      taskName: new FormControl('', [Validators.required]),
      taskType: new FormControl('', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      relatedSubcontractors: new FormControl([]),
      relatedContacts: new FormControl([]),
      relatedJobs: new FormControl([]),
      assignedTeamMembers: new FormControl([]),
      estimatedDuration: new FormControl(''),
      workEstimateUnit: new FormControl('days'),
      tags: new FormControl(''),
      tagsData: new FormControl(''),
      description: new FormControl(''),
    });

    this.initializeForm();
  }

  private initializeForm() {
    const allRelatedContacts$ = this.jobService.allRelatedContacts();
    const allTeamMembers$ = this.jobService.allTeamMembers();
    const allSubcontractors$ = this.jobService.allSubcontractors();
    const allJobsByCompanyID$ = this.jobService.getAllJobsByCompanyID();

    const combinedRequests$ = forkJoin({
      relatedContacts: allRelatedContacts$,
      allTeamMembers: allTeamMembers$,
      subcontractors: allSubcontractors$,
      jobs: allJobsByCompanyID$,
    });

    this.subscriptions.add(
      combinedRequests$.subscribe({
        next: (responses) => {
          this.relatedContacts = responses.relatedContacts.payload.map(contact => ({
            id: contact.id,
            name: contact.name
          }));

          // Map subcontractors to contain only id and name
          this.allSubcontractors = responses.subcontractors.payload.map(subcontractor => ({
            id: subcontractor.id,
            name: subcontractor.name
          }));

          // Map subcontractors to contain only id and name
          this.allTeamMembers = responses.allTeamMembers.payload.map(teamMember => ({
            id: teamMember.id,
            name: teamMember.name
          }));

          // Map Jobs to contain only id and name
          this.Jobs = responses.jobs.map(job => ({
            id: job.id,
            name: job.name
          }));

          debugger
          // After getting successful responses from all APIs, patch the form
          if (this.data) {
            this.modelMain = this.data;

            if (this.modelMain.type == "automationtask") {
              this.updateData = Object.assign({}, this.modelMain.actionObj);
              this.updateData.assignedTeamMembers = this.updateData.assignedTeamMembers?.map(memeber => memeber.id ?? memeber) ?? [];
            }
            else {
              this.updateData = Object.assign({}, this.modelMain);
              this.updateData.assignedTeamMembers = this.updateData.relatedTeamMembers?.map(memeber => memeber.id ?? memeber) ?? [];
            }

            if (this.updateData.id) {
              const estimate = this.updateData.estimatedDuration;
              this.updateData.relatedContacts = this.updateData.relatedContacts?.map(contact => contact.id ?? contact) ?? [];
              this.updateData.relatedSubcontractors = this.updateData.relatedSubcontractors?.map(subcontractor => subcontractor.id ?? subcontractor) ?? [];
              this.updateData.relatedJobs = this.updateData.relatedJobs?.map(job => job.id ?? job) ?? [];

              this.updateData.estimatedDuration = estimate.split(' ')[0].toString();
              this.updateData.workEstimateUnit = estimate.split(' ')[1].toString();
              this.patchFormValues(this.updateData);
            }
          }

          this.handleCustomFields()

        },
        error: (err) => {
          console.error('Error fetching data:', err);
          // Handle errors as needed
        },
      })
    );
  }

  fields: DynamicField[] = []
  fieldsValueForm: FormGroup<{}>;
  existingCustomFieldsValues: any;
  handleCustomFields() {
    this.subscriptions.add(
      this.fieldService.getFieldsByEntityType(EntityTypes.Task).subscribe({
        next: (res) => {
          this.fields = res
          if (this.updateData.id) {
            this.existingCustomFieldsValues = this.updateData.customFieldValues;
            this.fields.forEach(field => {
              const validators = field.isRequired ? [Validators.required] : [];
              const existingFieldValue = this.existingCustomFieldsValues.find(value => value.fieldDefinitionId === field.id)?.fieldValue;
              let existingValue: any = '';
              if (existingFieldValue) {
                try {
                  existingValue = field.multiSelect ? JSON.parse(existingFieldValue) : existingFieldValue;
                } catch (e) {
                  console.error(`Error parsing field value for field ${field.id}:`, e);
                  existingValue = '';
                }
              }
              if (field.fieldType === FieldTypes.Dropdown && !field.multiSelect) {
                existingValue = Number(existingValue);
              }
              if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
                const valueArray = Array.isArray(existingValue) ? existingValue : []; // Ensure it's an array
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl(valueArray, validators));
              } else {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl(existingValue, validators));
              }
            });
          }
          else {
            this.fields.forEach(field => {
              const validators = field.isRequired ? [Validators.required] : [];
              if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl([], validators));
              } else {
                this.fieldsValueForm.addControl(field.id.toString(), new FormControl('', validators));
              }
            });
          }


        }
      })
    )
  }

  private patchFormValues(data: any): void {
    debugger
    this.taskForm.patchValue({
      id: data.id,
      taskName: data.taskName || '',
      taskType: data.taskType || '',
      priority: data.priority || '',
      status: data.status || '',
      startDate: data.startDate || null,
      endDate: data.endDate || data.startDate,
      relatedSubcontractors: data.relatedSubcontractors || [],
      relatedContacts: data.relatedContacts || [],
      relatedJobs: data.relatedJobs || [],
      assignedTeamMembers: data.assignedTeamMembers || [],
      estimatedDuration: data.estimatedDuration || '',
      description: data.description || '',
    });

    if (data.tags) {
      this.taskForm.get('tags').setValue(data.tags);
      this.taskForm.get('tagsData').setValue(data.tags.split(',').map(tag => ({
        display: tag.trim(),
        value: tag.trim()
      })));
    }
  }


  onSubmit(): void {
    this.taskForm.markAllAsTouched();
    this.taskForm.value.tags = this.taskForm.value.tagsData.map(tag => tag.value).join(', ');

    if (this.taskForm.valid && this.fieldsValueForm.valid) {

      console.log(JSON.stringify(this.taskForm.value))
      debugger
      if (this.modelMain.type == "automationtask") {
        let data = this.taskForm.value;
        data.estimatedDuration = this.taskForm.value.estimatedDuration.toString() + ' ' + this.taskForm.value.workEstimateUnit.toString()
        this.dialogRef.close(data);
        return
      }

      if (this.updateData.id) {
        this.updateTask();
      } else {
        this.addTask();
      }
    }
  }

  private updateTask(): void {
    let data = this.taskForm.value;
    data.estimatedDuration = this.taskForm.value.estimatedDuration.toString() + ' ' + this.taskForm.value.workEstimateUnit.toString()
    data.customFieldValues = this.fields.map(field => {
      const fieldControl = this.fieldsValueForm.get(field.id.toString());
      let processedValue: any = fieldControl?.value;
      if (processedValue !== undefined) {
        if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
          processedValue = JSON.stringify(processedValue);
        }
        else if (typeof processedValue === 'string') {
          processedValue = processedValue.replace(/^"(.*)"$/, '$1');
        }
        if (field.fieldType === FieldTypes.Date) {
          const dateValue = new Date(processedValue);
          if (!isNaN(dateValue.getTime())) {
            processedValue = dateValue.toISOString();
          } else {
            console.warn(`Invalid date format: ${processedValue}`);
            processedValue = processedValue;
          }
        }
      }
      return {
        FieldDefinitionId: field.id,
        FieldValue: processedValue.toString()
      };
    });
    this.subscriptions.add(
      this.taskService.updateTask(data).subscribe(
        {
          next: updatedTask => {
            this.dialogRef.close("update");
            this.showSnackbar('Record updated successfully', 'success-snackbar');
          },
          error: error => {
            console.error('Error updating task', error);
            this.showSnackbar('Error updating task', 'error-snackbar');
          }
        }
      ))
  }

  private addTask(): void {
    debugger
    let data = this.taskForm.value;
    data.estimatedDuration = this.taskForm.value.estimatedDuration.toString() + ' ' + this.taskForm.value.workEstimateUnit.toString()
    data.customFieldValues = this.fields.map(field => {
      const fieldControl = this.fieldsValueForm.get(field.id.toString());
      let processedValue: any = fieldControl?.value;
      if (processedValue !== undefined) {
        if (field.fieldType === FieldTypes.Dropdown && field.multiSelect) {
          processedValue = JSON.stringify(processedValue);
        }
        else if (typeof processedValue === 'string') {
          processedValue = processedValue.replace(/^"(.*)"$/, '$1');
        }
        if (field.fieldType === FieldTypes.Date) {
          const dateValue = new Date(processedValue);
          if (!isNaN(dateValue.getTime())) {
            processedValue = dateValue.toISOString();
          } else {
            console.warn(`Invalid date format: ${processedValue}`);
            processedValue = processedValue;
          }
        }
      }
      return {
        FieldDefinitionId: field.id,
        FieldValue: processedValue.toString()
      };
    });
    this.subscriptions.add(
      this.taskService.addTask(data).subscribe(
        {
          next: newTask => {
            this.dialogRef.close("added");
            this.showSnackbar('Record inserted successfully', 'success-snackbar');
          },
          error: error => {
            console.error('Error adding task', error);
            this.showSnackbar('Error adding task', 'error-snackbar');
          }
        }
      ))
  }

  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
