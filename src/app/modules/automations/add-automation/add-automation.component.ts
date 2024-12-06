import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, forkJoin, map, of } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { AddcontactComponent } from '../../contact/addcontact/addcontact.component';
import { JobService } from 'src/app/core/services/job.service';
import { WorkflowService } from 'src/app/core/workflow.service';
import { SendEmailComponent } from '../ModalComponents/send-email/send-email.component';
import { CallWebhookComponent } from '../ModalComponents/call-webhook/call-webhook.component';
import { SendTextMessageComponent } from '../ModalComponents/send-text-message/send-text-message.component';
import { ChangeFieldComponent } from '../ModalComponents/change-field/change-field.component';
import { TaskCreationDialogComponent } from '../../dashboard/task-creation-dialog/task-creation-dialog.component';
import { AddJobWorkOrderComponent } from '../../job/add-job-work-order/add-job-work-order.component';
import { AutomationEntity } from '../interfaces';
import { AutomationAndTemplateService } from 'src/app/core/services/automation-and-template.service';
import { WorkFlowType } from 'src/app/core/interfaces';
import { CreateTaskComponent } from '../ModalComponents/create-task/create-task.component';
import { daysOfWeek, timeUnitOptions } from '../common';
import { CreateWorkOrderComponent } from '../ModalComponents/create-work-order/create-work-order.component';
import { ToastrService } from 'ngx-toastr';

interface IActions {
  id: number
  actionType: string
  name: string
  actionObj: any
}


@Component({
  selector: 'app-add-automation',
  templateUrl: './add-automation.component.html',
  styleUrls: ['./add-automation.component.css']
})
export class AddAutomationComponent {
  timeUnitOptions = timeUnitOptions;
  daysOfWeek = daysOfWeek;
  selectedTime: Date = new Date(); // Initialize with current time
  timeControl = new FormControl(new Date()); // Form control for time
  showActionsForms = false;
  addedActions: IActions[] = []
  addedConditions = [];
  requireAllConditionsToBeTrue = false



  private subscriptions: Subscription = new Subscription();
  automationForm!: FormGroup;
  updateData: any;
  relatedcontacts: any;
  conditionForm: FormGroup;
  showConditionInsertionRow: boolean = true;
  showActionInsertionRow: boolean = true;
  WorkFlowStatuses: any[] = []
  actionForm!: FormGroup;
  rightOperands: any[] = [];
  existingIndexOfCondition: null;
  allStatuses: any[] = [];
  allSalesReps: any[] = [];
  allRelatedContacts: any[] = [];
  allResources: any[] = [];
  allSubcontractors: any[] = [];
  allContactWorkFlows: any[] = [];
  allJobWorkFlows: any[] = [];
  allWorkOrderWorkFlows: any[] = [];
  allGlobalWorkFlows: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddcontactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public contactService: ContactService,
    public jobService: JobService,
    public toastr: ToastrService,
    public workflowService: WorkflowService,
    private templateService: AutomationAndTemplateService,

  ) {
    if (data) {
      this.updateData = data;
    }
  }

  ngOnInit(): void {
    this.fetchData()
    this.automationForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),

      triggerType: new FormControl('eventBase', Validators.required),
      //when trigger type is event base
      triggerRecord: new FormControl('contact', Validators.required),
      whenEntityIs: new FormControl(''),

      //when trigger type is time based
      duration: new FormControl(0),
      timeUnit: new FormControl(''),
      beforeAfter: new FormControl('after'),
      isActive: new FormControl(true),
      isSpecificDay: new FormControl(false),
      selectedDay: new FormControl({ value: '', disabled: true }),
      isSpecificTime: new FormControl(false),
      selectedTime: new FormControl({ value: '', disabled: true }),
      automationTriggerDateField: new FormControl(''),
      requireAllConditionsToBeTrue: new FormControl(false)
    });

    this.automationForm.get('isSpecificDay').valueChanges.subscribe((value) => {
      const selectedDayControl = this.automationForm.get('selectedDay');
      value ? selectedDayControl.enable() : selectedDayControl.disable();
    });

    this.automationForm.get('isSpecificTime').valueChanges.subscribe((value) => {
      const selectedTimeControl = this.automationForm.get('selectedTime');
      value ? selectedTimeControl.enable() : selectedTimeControl.disable();
    });

    this.conditionForm = new FormGroup({
      id: new FormControl(0),
      field: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      comparison: new FormControl('==', Validators.required),
      onlyIfModified: new FormControl(false),
    });

    this.actionForm = new FormGroup({
      id: new FormControl(0),
      actionType: new FormControl('sendEmail'),
      name: new FormControl(''),
      actionObj: new FormControl({})
    });

    this.subscribeToLeftOperandChanges()
  }

  closeDailog() {
    this.dialogRef.close();
  }

  subscribeToLeftOperandChanges(): void {
    this.automationForm.get('triggerRecord')?.valueChanges.subscribe((selectedtriggerRecord) => {
      this.resetConditionForm()
      this.updateLeftOperands(selectedtriggerRecord)
    });

    this.conditionForm.get('field')?.valueChanges.subscribe((selectedLeftOperandId) => {
      const workFlowType = this.automationForm.value.triggerRecord
      this.subscriptions.add(
        this.getRightOperandsForLeftOperand(selectedLeftOperandId, workFlowType).subscribe((operands) => {
          this.rightOperands = operands;
        })
      );
    });
  }

  getRightOperandsForLeftOperand(selectedLeftOperandId: string, workFlowType: string): Observable<any[]> {
    switch (selectedLeftOperandId) {
      case 'status':
        return of(this.allStatuses)
      case 'workflowId':
        switch (workFlowType) {
          case 'contact':
            return of(this.allContactWorkFlows)
          case 'job':
            return of(this.allJobWorkFlows)
          case 'workorder':
            return of(this.allWorkOrderWorkFlows)
          default:
            return of(this.allGlobalWorkFlows)
        }
      case 'saleRep':
        return of(this.allSalesReps)
      case 'source':
        return of(this.allResources)
      case 'subcontractor':
        return of(this.allSubcontractors)
      case 'relatedContacts':
        return of(this.allRelatedContacts)
      default:
        return of([]);
    }
  }

  onSubmit(): void {
    const automationFormValue = this.automationForm.value;
    const data: AutomationEntity = {
      id: automationFormValue.id,
      name: automationFormValue.name,
      isActive: automationFormValue.isActive,
      triggerType: automationFormValue.triggerType,
      triggerRecord: automationFormValue.triggerRecord,
      whenEntityIs: automationFormValue.whenEntityIs,
      duration: automationFormValue.duration,
      timeUnit: automationFormValue.timeUnit,
      beforeAfter: automationFormValue.beforeAfter,
      isSpecificDay: automationFormValue.isSpecificDay,
      selectedDay: automationFormValue.selectedDay,
      isSpecificTime: automationFormValue.isSpecificTime,
      selectedTime: automationFormValue.selectedTime,
      automationTriggerDateField: automationFormValue.automationTriggerDateField,
      requireAllConditionsToBeTrue: automationFormValue.requireAllConditionsToBeTrue,
      conditions: this.addedConditions, // Initialize empty array
      actions: this.addedActions // Initialize empty array
    };

    console.log(data)
    if (data.id > 0) {
      this.templateService.updateAutomation(data).subscribe({
        next: (res) => {
          console.log(res)
          this.toastr.success("Automation updated successfully")
          this.closeDailog()
        },
        error: (err) => {
          this.toastr.success("An error occurred while updating automation")
          console.log(err);
        },
      })
    }
    else {
      this.templateService.createAutomation(data).subscribe({
        next: (res) => {
          console.log(res)
          this.toastr.success("Automation created successfully")
          this.closeDailog()
        },
        error: (err) => {
          console.log(err);
          this.toastr.success("An error occurred while creating automation")
        },
      })
    }
  }

  getRelatedcontacts() {
    this.subscriptions.add(
      this.contactService.getRelatedContactsDropDown().subscribe({
        next: (res) => {
          this.relatedcontacts = res.payload;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  ngOnDestroy() {
    //Unsubscribe All subscriptions
    this.subscriptions.unsubscribe();
  }

  resetConditionForm() {
    this.conditionForm = new FormGroup({
      id: new FormControl(0),
      field: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      comparison: new FormControl('==', Validators.required),
      onlyIfModified: new FormControl(false),
    })
    this.subscribeToLeftOperandChanges()
    this.showConditionInsertionRow = false;
    this.existingIndexOfCondition = null
  }

  resetAutomationForm() {
    this.automationForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),

      triggerType: new FormControl('eventBase'),
      //when trigger type is event base
      triggerRecord: new FormControl('contact'),
      whenEntityIs: new FormControl(''),

      //when trigger type is time based
      duration: new FormControl(0),
      timeUnit: new FormControl(''),
      beforeAfter: new FormControl(''),
      isSpecificDay: new FormControl(false),
      isActive: new FormControl(true),
      selectedDay: new FormControl(''),
      isSpecificTime: new FormControl(false),
      selectedTime: new FormControl(''),
      automationTriggerDateField: new FormControl(''),
      requireAllConditionsToBeTrue: new FormControl(false)
    });
    this.subscribeToLeftOperandChanges()
  }

  resetActionForm() {
    this.actionForm = new FormGroup({
      id: new FormControl(0),
      actionType: new FormControl('sendEmail'),
      name: new FormControl(''),
      actionObj: new FormControl({})
    });
    this.subscribeToLeftOperandChanges()
    this.showActionInsertionRow = false;
    this.showActionsForms = false;
  }

  leftOperands: { id: string, name: string }[] = [
    { id: "status", name: "Status" },
    { id: "workflowId", name: "WorkFlow" },
    { id: "saleRep", name: "Sales Rep" },
    { id: "source", name: "Source" },
    { id: "subcontractor", name: "Subcontractor" },
    { id: "relatedContacts", name: "Related contacts" }
  ];

  AddConditionToList() {
    this.conditionForm.markAllAsTouched()
    const condition = this.conditionForm.value;
    condition.value = condition.value.toString()
    if (!this.conditionForm.valid)
      return

    if (this.addedConditions.length > 0 && this.existingIndexOfCondition) {
      this.addedConditions[this.existingIndexOfCondition] = condition;
    } else {
      this.addedConditions.push(condition);
    }
    this.processFieldNameAndValue(this.automationForm.value.triggerRecord)
    this.resetConditionForm()
  }

  removeConditionFormList(item) {
    var index = this.addedConditions.findIndex(x => x == item)
    if (index != -1) {
      this.addedConditions.splice(index, 1)
    }
  }

  editCondition(item: any, index) {
    this.existingIndexOfCondition = index
    this.conditionForm.patchValue(item)
    this.showConditionInsertionRow = true
  }

  actions: { id: string, name: string }[] = [
    { id: "changeField", name: "Change any field on an object" },
    { id: "sendTextMessage", name: "Send Text Message" },
    { id: "sendEmail", name: "Send Email" },
    { id: "callWebhook", name: "Call Webhook" },
    { id: "createTask", name: "Create Task" },
    { id: "createWorkOrder", name: "Work Order" },
  ];


  handleActionChange() {
    switch (this.actionForm.value.actionType) {
      case 'sendEmail':
        this.openSendEmailModal(null, -1);
        break;
      case 'createWorkOrder':
        this.openCreateWorkOrderModal(null, -1);
        break;
      case 'createTask':
        this.openCreateTaskModal(null, -1);
        break;
      case 'callWebhook':
        this.callWebhook(null, -1);
        break;
      case 'sendTextMessage':
        this.sendTextMessage(null, -1);
        break;
      case 'changeField':
        this.openChangeFieldModal(null, -1);
        break;
      default:
        break;
    }
  }

  openCreateWorkOrderModal(data: any, index: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.type = "automationWorkOrder"
      data.FormTitle = 'Create WorkOrder';
      data.Request_Type = 'Add';
      data.isUpdate = false
      dialogRef = this.dialog.open(CreateWorkOrderComponent, {
        width: '800px',
        data: data,
        disableClose: true,
      });
    } else {
      data.type = "automationWorkOrder"
      data.FormTitle = 'Update WorkOrder';
      data.Request_Type = 'Save';
      data.isUpdate = true
      dialogRef = this.dialog.open(CreateWorkOrderComponent, {
        width: '800px',
        data: data,
        disableClose: true,
      });
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Returned Object:', result);

      if (result && index != -1 && data.isUpdate) {
        const action: IActions = {
          id: data.id,
          actionType: 'createWorkOrder',
          name: 'Update WorkOrder',
          actionObj: result
        }
        this.addedActions[index] = action

      } else if (result) {
        const action: IActions = {
          id: 0,
          actionType: 'createWorkOrder',
          name: 'Create WorkOrder',
          actionObj: result
        }
        this.addedActions.push(action)
      }
    });
  }

  openCreateTaskModal(data: any, index: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.type = "automationtask"
      data.FormTitle = 'Create Task';
      data.Request_Type = 'Add';
      data.isUpdate = false
      dialogRef = this.dialog.open(CreateTaskComponent, {
        width: '800px',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Update Task';
      data.Request_Type = 'Save';
      data.type = "automationtask"
      data.isUpdate = true
      dialogRef = this.dialog.open(CreateTaskComponent, {
        width: '800px',
        data: data,
        disableClose: true,
      });
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Returned Object:', result);
      if (result && index != -1 && data.isUpdate) {
        const action: IActions = {
          id: data.id,
          actionType: 'createTask',
          name: 'Create Task',
          actionObj: result
        }
        this.addedActions[index] = action

      } else if (result) {
        const action: IActions = {
          id: 0,
          actionType: 'createTask',
          name: 'Create Task',
          actionObj: result
        }
        this.addedActions.push(action)
      }
    });
  }

  callWebhook(data: any, index: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Call Webhook';
      data.Request_Type = 'Add';
      data.isUpdate = false
      dialogRef = this.dialog.open(CallWebhookComponent, {
        width: '600px',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Call Webhook';
      data.Request_Type = 'Save';
      data.isUpdate = true


      dialogRef = this.dialog.open(CallWebhookComponent, {
        width: '600px',
        data: data,
        disableClose: true,
      });
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Returned Object:', result);

      if (result && index != -1 && data.isUpdate) {
        const action: IActions = {
          id: data.id,
          actionType: 'callWebhook',
          name: 'Call Webhook',
          actionObj: result
        }
        this.addedActions[index] = action

      } else if (result) {
        const action: IActions = {
          id: 0,
          actionType: 'callWebhook',
          name: 'Call Webhook',
          actionObj: result
        }
        this.addedActions.push(action)
      }
    });
  }

  sendTextMessage(data: any, index: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Send Text Message';
      data.Request_Type = 'Add';
      data.isUpdate = false
      dialogRef = this.dialog.open(SendTextMessageComponent, {
        width: '600px',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Send Text Message';
      data.Request_Type = 'Save';
      data.isUpdate = true


      dialogRef = this.dialog.open(SendTextMessageComponent, {
        width: '600px',
        data: data,
        disableClose: true,
      });
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Returned Object:', result);

      if (result && index != -1 && data.isUpdate) {
        const action: IActions = {
          id: data.id,
          actionType: 'sendTextMessage',
          name: 'Send Text Message',
          actionObj: result
        }
        this.addedActions[index] = action

      } else if (result) {
        const action: IActions = {
          id: 0,
          actionType: 'sendTextMessage',
          name: 'Send Text Message',
          actionObj: result
        }
        this.addedActions.push(action)
      }
    });
  }

  openChangeFieldModal(data: any, index: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Change Field';
      data.Request_Type = 'Add';
      data.TriggerRecord = this.automationForm.value.triggerRecord;
      data.isUpdate = false
      dialogRef = this.dialog.open(ChangeFieldComponent, {
        width: '800px',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Change Field';
      data.Request_Type = 'Save';
      data.isUpdate = true
      data.TriggerRecord = this.automationForm.value.triggerRecord;

      dialogRef = this.dialog.open(ChangeFieldComponent, {
        width: '800px',
        data: data,
        disableClose: true,
      });
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Returned Object:', result);

      if (result && index != -1 && data.isUpdate) {
        const action: IActions = {
          id: data.id,
          actionType: 'changeField',
          name: 'Change Field',
          actionObj: result
        }
        this.addedActions[index] = action

      } else if (result) {
        const action: IActions = {
          id: 0,
          actionType: 'changeField',
          name: 'Change Field',
          actionObj: result
        }
        this.addedActions.push(action)
      }
    });
  }

  openSendEmailModal(data: any, index: any): void {
    let dialogRef: any = {};
    if (data == null) {
      data = {};
      data.FormTitle = 'Send Email';
      data.Request_Type = 'Add';
      data.isUpdate = false
      dialogRef = this.dialog.open(SendEmailComponent, {
        width: '600px',
        data: data,
        disableClose: true,
      });
    } else {
      data.FormTitle = 'Send Email';
      data.Request_Type = 'Save';
      data.isUpdate = true


      dialogRef = this.dialog.open(SendEmailComponent, {
        width: '600px',
        data: data,
        disableClose: true,
      });
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Returned Object:', result);
      debugger
      if (result && index != -1 && data.isUpdate) {
        const action: IActions = {
          id: data.id,
          actionType: 'sendEmail',
          name: 'Send Email: ' + result.template.name,
          actionObj: result
        }
        this.addedActions[index] = action

      } else if (result) {
        const action: IActions = {
          id: 0,
          actionType: 'sendEmail',
          name: 'Send Email: ' + result.template.name,
          actionObj: result
        }
        this.addedActions.push(action)
      }
    });
  }


  editAction(action: IActions, index: number) {
    switch (action.actionType) {
      case 'sendEmail':
        this.openSendEmailModal(action, index);
        break;
      case 'createWorkOrder':
        this.openCreateWorkOrderModal(action, index);
        break;
      case 'createTask':
        this.openCreateTaskModal(action, index);
        break;
      case 'callWebhook':
        this.callWebhook(action, index);
        break;
      case 'sendTextMessage':
        this.sendTextMessage(action, index);
        break;
      case 'changeField':
        this.openChangeFieldModal(action, index);
        break;
      default:
        break;
    }
  }

  removeActionFormList(action) {
    var index = this.addedActions.findIndex(x => x == action)
    if (index != -1) {
      this.addedActions.splice(index, 1)
    }
  }
  updateLeftOperands(event: any) {
    debugger
    const selectedValue = event;
    switch (selectedValue) {
      case 'contact':
        // this.leftOperands = this.contactProperties;
        break;
      case 'job':
        // this.leftOperands = this.jobProperties;
        break;
      case 'workorder':
        // this.leftOperands = this.workOrderProperties;
        break;
      default:
        // this.leftOperands = []; // Handle other cases if needed
        break;
    }
  }


  fetchData() {
    forkJoin([
      this.getAllStatuses(),
      this.getAllSalesReps(),
      this.getAllSubcontractors(),
      this.getRelatedContactsDropDown(),
      this.getAllResources(),
      this.getAllWorkFlows(WorkFlowType.contact),
      this.getAllWorkFlows(WorkFlowType.jobs),
      this.getAllWorkFlows(WorkFlowType.workOrder),
      this.getAllWorkFlows(WorkFlowType.global),
    ]).subscribe({
      next: (results: any[]) => {
        this.allStatuses = results[0];
        this.allSalesReps = results[1];
        this.allSubcontractors = results[2];
        this.allRelatedContacts = results[3];
        this.allResources = results[4];
        this.allContactWorkFlows = results[5];
        this.allJobWorkFlows = results[6];
        this.allWorkOrderWorkFlows = results[7];
        this.allGlobalWorkFlows = results[8];

        if (this.updateData.id > 0) {
          console.log(this.updateData)
          this.automationForm.patchValue(this.updateData)
          this.addedConditions = this.updateData.conditions,
          this.addedActions = this.updateData.actions
          this.processFieldNameAndValue(this.automationForm.value.triggerRecord)
        }

      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    }
    );
  }

  getAllResources() {
    return this.contactService.allSource().pipe(
      map(res => {
        const sourceTypeDropdown = res.payload[0].dropDown.find(
          (dropdown: any) => dropdown.dropDownName === 'SourceType'
        );
        return sourceTypeDropdown.dropDownValues.map(x => ({ name: x.value, id: x.id }));
      }));
  }

  getAllStatuses() {
    return this.contactService.allStatus().pipe(
      map(res => res.payload.map(x => ({ name: x.statusName + " (" + x.workFlowName + ")", id: x.id })))
    );
  }

  getAllSalesReps() {
    return this.contactService.allSalesRep().pipe(
      map(res => res.payload.map(x => ({ name: x.name, id: x.id })))
    );
  }

  getAllSubcontractors() {
    return this.contactService.allSubcontractors().pipe(
      map(res => res.payload.map(x => ({ name: x.name, id: x.id })))
    );
  }

  getRelatedContactsDropDown() {
    return this.contactService.getRelatedContactsDropDown().pipe(
      map(res => res.payload.map(x => ({ name: x.name, id: x.id })))
    );
  }

  getAllWorkFlows(recordType: number) {
    return this.workflowService.getWorkFlowByType(recordType).pipe(
      map(res => res.payload?.map(x => ({ name: x.workFlowName, id: x.id }) ?? []))
    );
  }

  processFieldNameAndValue(triggerRecord: string) {
    this.addedConditions.forEach(y => {
      try {
        switch (y.field) {
          case 'status':
            y.fieldName = "Status"
            y.fieldValue = this.allStatuses.find(s => s.id.toString() == y.value).name ?? ""
            break;
          case 'workflowId':
            y.fieldName = "WorkFlow"
            switch (triggerRecord) {
              case 'contact':
                y.fieldValue = this.allContactWorkFlows.find(s => s.id.toString() == y.value).name ?? ""
                break;
              case 'job':
                y.fieldValue = this.allJobWorkFlows.find(s => s.id.toString() == y.value).name ?? ""
                break;
              case 'workorder':
                y.fieldValue = this.allWorkOrderWorkFlows.find(s => s.id.toString() == y.value).name ?? ""
                break;
              default:
                y.fieldValue = this.allGlobalWorkFlows.find(s => s.id.toString() == y.value).name ?? ""
                break;
            }
            break;
          case 'saleRep':
            y.fieldName = "Sales Representative"
            y.fieldValue = this.allSalesReps.find(s => s.id.toString() == y.value).name ?? ""
            break;
          case 'source':
            y.fieldName = "Source"
            y.fieldValue = this.allResources.find(s => s.id.toString() == y.value).name ?? ""
            break;
          case 'subcontractor':
            y.fieldName = "Sub Contractor"
            y.fieldValue = this.allSubcontractors.find(s => s.id.toString() == y.value).name ?? ""
            break;
          case 'relatedContacts':
            y.fieldName = "Related Contact"
            y.fieldValue = this.allRelatedContacts.find(s => s.id.toString() == y.value).name ?? ""
            break;
          default:
            y.fieldValue = "unknown"
            break;
        }
      } catch (error) {
        console.error("Error parsing conditions:");
      }
    })
  }


  // For Job class
  jobProperties = [
    { id: 'Name', name: 'Name' },
    { id: 'WorkflowId', name: 'Workflow ID' },
    { id: 'WorkOrderStatus', name: 'Work Order Status' },
    { id: 'StartDate', name: 'Start Date' },
    { id: 'DueDate', name: 'Due Date' },
    { id: 'Notes', name: 'Notes' },
    { id: 'LastStatusChangeDate', name: 'Last Status Change Date' },
    { id: 'ContactId', name: 'Contact ID' },
    { id: 'JobId', name: 'Job ID' }
  ];

  // For ContactBoardsResponseDto class
  contactProperties = [
    { id: 'Id', name: 'ID' },
    { id: 'FirstName', name: 'First Name' },
    { id: 'LastName', name: 'Last Name' },
    { id: 'Company', name: 'Company' },
    { id: 'AddressLine1', name: 'Address Line 1' },
    { id: 'AddressLine2', name: 'Address Line 2' },
    { id: 'City', name: 'City' },
    { id: 'ZipCode', name: 'Zip Code' },
    { id: 'Email', name: 'Email' },
    { id: 'Website', name: 'Website' },
    { id: 'LastStatusChangeDate', name: 'Last Status Change Date' },
    { id: 'StateName', name: 'State Name' },
    { id: 'FaxNo', name: 'Fax Number' },
    { id: 'DisplayName', name: 'Display Name' },
    { id: 'StartDate', name: 'Start Date' },
    { id: 'EndDate', name: 'End Date' },
    { id: 'Description', name: 'Description' },
    { id: 'PicUrl', name: 'Picture URL' },
    { id: 'TeamMembers', name: 'Team Members' },
    { id: 'SalesReps', name: 'Sales Representatives' },
    { id: 'SourceId', name: 'Source ID' },
    { id: 'StateId', name: 'State ID' },
    { id: 'SalesRepId', name: 'Sales Rep ID' },
    { id: 'SubContractorId', name: 'Subcontractor ID' },
    { id: 'OfficeLocationId', name: 'Office Location ID' },
    { id: 'WorkFlowId', name: 'Workflow ID' },
    { id: 'StatusId', name: 'Status ID' }
  ];

  // For WorkOrder class
  workOrderProperties = [
    { id: 'WorkOrderPriority', name: 'Work Order Priority' },
    { id: 'Name', name: 'Name' },
    { id: 'WorkflowId', name: 'Workflow ID' },
    { id: 'WorkOrderStatus', name: 'Work Order Status' },
    { id: 'StartDate', name: 'Start Date' },
    { id: 'DueDate', name: 'Due Date' },
    { id: 'Notes', name: 'Notes' },
    { id: 'LastStatusChangeDate', name: 'Last Status Change Date' },
    { id: 'ContactId', name: 'Contact ID' },
    { id: 'JobId', name: 'Job ID' }
  ];
}
