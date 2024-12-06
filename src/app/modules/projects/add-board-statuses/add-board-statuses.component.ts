import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { WorkFlowType } from 'src/app/core/interfaces';
import { ContactService } from 'src/app/core/services/contact.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { WorkflowService } from 'src/app/core/workflow.service';

@Component({
  selector: 'app-add-board-statuses',
  templateUrl: './add-board-statuses.component.html',
  styleUrls: ['./add-board-statuses.component.css']
})
export class AddBoardStatusesComponent {

  closeDailog() {
    this.dialogRef.close();
  }
  updateData: any;
  statuForm: any;
  WorkFlowStatuses: any;
  statuses: any[] = [];

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AddBoardStatusesComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contactService: ContactService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private workflowService: WorkflowService,
  ) {
    
    if (data) {
      this.updateData = data;
    }
    else {
      dialogRef.close();
    }
  }

  ngOnInit(): void {
    this.statuForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      statuses: new FormControl([], Validators.required),
      sortBy: new FormControl('workFlowName'),
      sortingOrder: new FormControl('asc'),
      total: new FormControl(''),
    });
    debugger
    this.onTypeChange(this.updateData.projectType)
  }

  onTypeChange(type: any) {
    if (type === 'contact') {
      this.getContactStatuses();
    } else if (type === 'job') {
      this.getJobStatuses();
    } else if (type === 'workorder') {
      this.getWorkOrderStatuses();
    }
    else {
      this.dialogRef.close();
    }
  }

  updateStatuses() {
    if (this.updateData.id > 0 && this.WorkFlowStatuses.length > 0) {
      var status = {
        id: this.updateData.id,
        name: this.updateData.name,
        statuses: this.updateData.workFlowStatuses.map((y: any) => {
          return this.WorkFlowStatuses.find(x => x.id == y.workFlowStatusId)
        }),
        sortBy: this.updateData.sortBy,
        sortingOrder: this.updateData.sortingOrder,
        total: this.updateData.total,
      }
      this.statuForm.patchValue(status)
    }
  }

  getWorkOrderStatuses() {
    this.workflowService.getWorkFlowByType(WorkFlowType.workOrder).subscribe({
      next: (res) => {
        this.WorkFlowStatuses = res.payload.reduce((statuses, workflow) => {
          workflow.statuses.forEach(status => {
            statuses.push({
              id: status.id,
              statusName: status.statusName,
              workFlowName: workflow.workFlowName, // Include workFlowName
              workFlowId: status.workFlowId      // Include workFlowId
            });
          });
          return statuses;
        }, []);
        this.updateStatuses()

      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

  getJobStatuses() {
    this.workflowService.getWorkFlowByType(WorkFlowType.jobs).subscribe({
      next: (res) => {
        this.WorkFlowStatuses = res.payload.reduce((statuses, workflow) => {
          workflow.statuses.forEach(status => {
            statuses.push({
              id: status.id,
              statusName: status.statusName,
              workFlowName: workflow.workFlowName, // Include workFlowName
              workFlowId: status.workFlowId      // Include workFlowId
            });
          });
          return statuses;
        }, []);
        debugger
        this.updateStatuses()

      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

  getContactStatuses() {
    this.workflowService.getWorkFlowByType(WorkFlowType.contact).subscribe({
      next: (res) => {
        this.WorkFlowStatuses = res.payload.reduce((statuses, workflow) => {
          workflow.statuses.forEach(status => {
            statuses.push({
              id: status.id,
              statusName: status.statusName,
              workFlowName: workflow.workFlowName, // Include workFlowName
              workFlowId: status.workFlowId      // Include workFlowId
            });
          });
          return statuses;
        }, []);
        this.updateStatuses()
        console.log(this.WorkFlowStatuses)
      },
      error: (err) => {
        console.log(err);
      }
    }
    );
  }

  resetStatusForm() {
    this.statuForm.reset();
    this.statuForm.patchValue({
      id: 0,
      name: '',
      statuses: [],
      sortBy: 'workFlowName',
      sortingOrder: 'asc',
      total: '',
    });
  }

  onSubmit() {
    debugger
    this.statuForm.markAllAsTouched()
    const status = this.statuForm.value;
    if (!this.statuForm.valid || status.statuses?.length == 0)
      return
      this.AddStatusToList()
    this.projectService.updateBoardStatuses(this.statuses[0]).subscribe({
      next: (res) => {
        this.toastr.success('Statuses updated successfully.');
        this.dialogRef.close();
      },
      error: (err) => {
        this.toastr.error(err.message);
        console.log(err);
      }
    });
  }


  AddStatusToList() {
    debugger
    this.statuForm.markAllAsTouched()
    const status = this.statuForm.value;
    if (!this.statuForm.valid || status.statuses?.length == 0)
      return

    if (status.statuses && status.statuses.length > 0) {
      status.workFlowStatuses = status.statuses;
      status.workFlowStatuses.forEach((x: any) => {
        x.WorkFlowStatusId = x.id;
      });
    }
    if (status.id && status.id != 0 && status.id != null && status.id != undefined) {
      const index = this.statuses.findIndex(x => x.id == status.id);
      if (index == -1) {
        this.statuses.push(status);
      }
      else {
        this.statuses[index] = status;
      }
    }
    else if (this.statuses.find(x => x.name == status.name)) {
      const index = this.statuses.findIndex(x => x.name == status.name);
      this.statuses[index] = status;
    }
    else {
      this.statuses.push(status);
    }
  }
}
