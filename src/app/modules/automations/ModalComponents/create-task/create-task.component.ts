import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, forkJoin } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { selectOptions, timeUnitOptions } from '../../common';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  timeUnitOptions = timeUnitOptions
  taskForm: FormGroup;
  updateData: any
  modelMain: any;
  private subscriptions: Subscription = new Subscription();
  relatedContacts: any;
  Jobs: any;
  allSubcontractors: any;
  allTeamMembers: any;
  selectOptions = selectOptions

  constructor(
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    private jobService: JobService,
    private authService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.taskForm = new FormGroup({
      id: new FormControl(null),
      taskName: new FormControl('', [Validators.required]),
      taskType: new FormControl('', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      relatedSubcontractors: new FormControl([]),
      relatedContacts: new FormControl([]),
      relatedJobs: new FormControl([]),
      assignedTeamMembers: new FormControl([]),
      estimatedDuration: new FormControl(''),
      workEstimateUnit: new FormControl('days'),
      tags: new FormControl(''),
      timeUnit: new FormControl('m'),
      duration: new FormControl(''),
      tagsData: new FormControl(''),
      description: new FormControl(''),
    });

    this.authService.getUserProfile().subscribe(user => {
      debugger
      this.selectOptions.push({
        label: user.payload.firstName + ' ' + user.payload.lastName,
        value: user.payload.id
      })
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
          this.allSubcontractors = responses.subcontractors.payload.map(subcontractor => ({
            id: subcontractor.id,
            name: subcontractor.name
          }));
          this.allTeamMembers = responses.allTeamMembers.payload.map(teamMember => ({
            id: teamMember.id,
            name: teamMember.name
          }));
          this.Jobs = responses.jobs.map(job => ({
            id: job.id,
            name: job.name
          }));
          if (this.data) {
            this.modelMain = this.data;
            this.updateData = Object.assign({}, this.modelMain.actionObj);
            this.updateData.assignedTeamMembers = this.updateData.assignedTeamMembers?.map(memeber => memeber) ?? [];
            const estimate = this.updateData.estimatedDuration;
            this.updateData.relatedContacts = this.updateData.relatedContacts?.map(contact => contact) ?? [];
            this.updateData.relatedSubcontractors = this.updateData.relatedSubcontractors?.map(subcontractor => subcontractor) ?? [];
            this.updateData.relatedJobs = this.updateData.relatedJobs?.map(job => job.id ?? job) ?? [];
            this.updateData.estimatedDuration = estimate.split(' ')[0].toString();
            this.updateData.workEstimateUnit = estimate.split(' ')[1].toString();
            this.patchFormValues(this.updateData);
          }
        },
        error: (err) => {
          console.error('Error fetching data:', err);
        },
      })
    );
  }



  private patchFormValues(data: any): void {
    debugger
    this.taskForm.patchValue({
      id: data.id,
      taskName: data.taskName || '',
      taskType: data.taskType || '',
      priority: data.priority || '',
      startDate: data.startDate || null,
      endDate: data.endDate || data.startDate,
      relatedSubcontractors: data.relatedSubcontractors || [],
      relatedContacts: data.relatedContacts || [],
      relatedJobs: data.relatedJobs || [],
      assignedTeamMembers: data.assignedTeamMembers || [],
      estimatedDuration: data.estimatedDuration || '',
      description: data.description || '',
      duration: data.duration || '',
      timeUnit: data.timeUnit || '',
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
    debugger
    this.taskForm.markAllAsTouched();
    this.taskForm.value.tags = "";

    if (this.taskForm.valid) {
      console.log(JSON.stringify(this.taskForm.value))
      let data = this.taskForm.value;
      data.estimatedDuration = this.taskForm.value.estimatedDuration.toString() + ' ' + this.taskForm.value.workEstimateUnit.toString()
      this.dialogRef.close(data);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
