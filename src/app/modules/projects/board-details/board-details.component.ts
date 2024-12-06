import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import { Board, Status } from '../BoardsInterfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { AddBoardComponent } from '../add-board/add-board.component';
import { AddBoardStatusesComponent } from '../add-board-statuses/add-board-statuses.component';
import { LocationService } from 'src/app/core/services/location.service';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.css']
})
export class BoardDetailsComponent {
  boardId: string;
  board: Board;
  boardStatuses: any[] = [];
  Locations: any[] = [];
  projectStatuses: any[] = [];
  selectedLocations = []
  teamMembers: any[] = [];
  subcontractors: any[] = [];
  salesReps: any[] = [];
  selectedteamMembers = []
  selectedsubcontractors = []
  selectedsalesReps = []


  constructor(private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private officeLocationService: LocationService,
    private contactService: ContactService,
    private toastr: ToastrService) {
    this.boardId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getBoardById(this.boardId);
    this.getLocations()
    this.getSalesRep()
    this.getSubcontractors()
    this.getTeamMembers()

  }

  getBoardById(boardId: string) {
    this.projectService.getBoardById(boardId).subscribe({
      next: (res: Board) => {
        this.board = res;
        this.board.statuses.forEach(status => {
          status.items.forEach(item => {
            if (this.board.projectType.toLowerCase() == 'job') {
              item.titleToDisplay = this.formatJobTitle(this.board.cardTitle, item);
            } else if (this.board.projectType.toLowerCase() == 'contact') {
              item.titleToDisplay = this.formatContactTitle(this.board.cardTitle, item);
            } else if (this.board.projectType.toLowerCase() == 'workorder') {
              item.titleToDisplay = this.formatWorkOrderTitle(this.board.cardTitle, item);
            }
          });

          status.items.forEach(x => {
            const lastStatusChangeDate = new Date(x.lastStatusChangeDate ?? new Date());
            const currentDate = new Date();
            const differenceInMilliseconds = currentDate.getTime() - lastStatusChangeDate.getTime();
            const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            x.daysWithInStatus = Math.max(differenceInDays, 0);
          });
        });

        // Now perform the move operations
        // Collect statuses to disable and move
        let statusesToMove = [];
        this.board.statuses.forEach(status => {
          if (status.workFlowStatuses.length > 1) {
            statusesToMove.push(status);
          }
        });

        // Disable and move statuses
        statusesToMove.forEach(statusToMove => {
          let statusIndex = this.board.statuses.indexOf(statusToMove);
          this.board.statuses.splice(statusIndex, 1);
          statusToMove.disabled = true;
          this.board.statuses.splice(statusIndex + statusToMove.workFlowStatuses.length, 0, statusToMove);
        });

        console.log(this.board.statuses)
        this.projectStatuses = [...this.board.statuses]
      },
      error: (err) => {
        console.error('Error fetching board:', err);
        this.toastr.error('Error fetching board');
        // redirect to projects
        this.router.navigate(['/boards']);
      }
    })
  }

  onDragDrop(event: CdkDragDrop<any[]>): void {
    debugger
    const previousStatusIndex = +event.previousContainer.id;
    const currentStatusIndex = +event.container.id;

    if (previousStatusIndex == currentStatusIndex) return;
    var current = this.board.statuses[currentStatusIndex];
    if (current.disabled)
      return;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    switch (this.board.projectType) {
      case 'job':
        this.updateJobStatuses(event.item.data.id, current.workFlowStatuses[0].workFlowId, current.workFlowStatuses[0].workFlowStatusId);
        break;
      case 'contact':
        this.updateContactStatuses(event.item.data.id, current.workFlowStatuses[0].workFlowId, current.workFlowStatuses[0].workFlowStatusId);
        break;
      case 'workorder':
        this.updateWorkorderStatuses(event.item.data.id, current.workFlowStatuses[0].workFlowId, current.workFlowStatuses[0].workFlowStatusId);
        break;
      default:
        break;
    }

  }

  updateJobStatuses(id, workflowid, workflowstatusid) {
    this.projectService.updateJobStatuses(id, workflowid, workflowstatusid).subscribe({
      next: (res) => {
        this.toastr.success('Status updated successfully');
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.toastr.error('Error updating status');
      }
    })
  }
  updateContactStatuses(id, workflowid, workflowstatusid) {
    this.projectService.updateContactStatuses(id, workflowid, workflowstatusid).subscribe({
      next: (res) => {
        this.toastr.success('Status updated successfully');
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.toastr.error('Error updating status');
      }
    })
  }
  updateWorkorderStatuses(id, workflowid, workflowstatusid) {
    this.projectService.updateWorkorderStatuses(id, workflowid, workflowstatusid).subscribe({
      next: (res) => {
        this.toastr.success('Status updated successfully');
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.toastr.error('Error updating status');
      }
    })
  }

  deleteBoardClick(data: any): void {
    if (data?.id == 0 || data?.id == undefined || data?.id == null)
      return

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
        this.projectService.deleteBoard(data.id).subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success("Deleted Successfully")
            this.router.navigate(['/boards']);
          },
          error: (err) => {
            this.toastr.error("Error While Deleting Board")
          }
        });
      }
    });
  }


  openBoardsModal(data: any = null): void {
    if (data == null) {
      data = {
        FormTitle: 'Add Board',
        Request_Type: 'Add',
        folderId: this.board.folderId ?? 0
      };
    } else {
      data.FormTitle = 'Edit Board';
      data.Request_Type = 'Save';
    }

    const dialogRef = this.dialog.open(AddBoardComponent, {
      width: '70vw',
      height: '80vh',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getBoardById(this.boardId);
    });
  }


  deleteBoardStatusClick(data: any) {
    if (data?.id == 0 || data?.id == undefined || data?.id == null)
      return

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
        this.projectService.deleteBoardStatus(data.id).subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success("Deleted Successfully")
            this.getBoardById(this.boardId);
          },
          error: (err) => {
            this.toastr.error("Error While Deleting Board Status")
          }
        });
      }
    });
  }

  updateBoardStatus(data: any) {
    if (data == null) {
      data = {
        FormTitle: 'Add Status',
        Request_Type: 'Add',
        projectType: this.board.projectType,
        boardId: this.board.id
      };
    } else {
      data.FormTitle = 'Edit Status';
      data.Request_Type = 'Save';
      data.projectType = this.board.projectType;
      data.boardId = this.board.id;
    }

    const dialogRef = this.dialog.open(AddBoardStatusesComponent, {
      width: '60vw',
      height: '60vh',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getBoardById(this.boardId);
    });
  }

  getLocations() {
    this.officeLocationService.allOfficeLocations().subscribe(
      (response: any) => {
        this.Locations = response.payload;
      },
      (error) => {
        console.error('Error loading paged office locations', error);
      }
    );
  }

  getTeamMembers() {

    this.contactService.allTeamMembers().subscribe({
      next: (res) => {
        this.teamMembers = res.payload;
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  getSubcontractors() {

    this.contactService.allSubcontractors().subscribe({
      next: (res) => {
        this.subcontractors = res.payload;
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  getSalesRep() {

    this.contactService.allSalesRep().subscribe({
      next: (res) => {
        this.salesReps = res.payload;
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  filterProjects() {
    debugger
    if (!this.board || !this.board.statuses) return;

    const selectedLocationIds = this.selectedLocations.map(location => location.id);
    const selectedsalesRepsIds = this.selectedsalesReps.map(salesRep => salesRep.id);
    const selectedsubcontractorsIds = this.selectedsubcontractors.map(subcontractor => subcontractor.id);
    const selectedteamMembersIds = this.selectedteamMembers.map(teamMember => teamMember.id);

    const copiedStatuses = JSON.parse(JSON.stringify(this.board.statuses));
    copiedStatuses.forEach(status => {
      if (!status.items) return;
      status.items = status.items.filter(project => {
        const passLocation = selectedLocationIds.length === 0 || selectedLocationIds.includes(project.officeLocationId);
        const passSalesRep = selectedsalesRepsIds.length === 0 || selectedsalesRepsIds.includes(project.salesRepsentativeId || project.salesRepId);
        const passSubcontractor = selectedsubcontractorsIds.length === 0 || selectedsubcontractorsIds.includes(project.subContractorId);
        const passTeamMember = selectedteamMembersIds.length === 0 ||
          (project.teamMembers && project.teamMembers.some(member =>
            selectedteamMembersIds.includes(member.id)
          )) ||
          (project.teamMememberId && project.teamMememberId.some(member =>
            selectedteamMembersIds.includes(member)
          ));

        return passLocation && passSalesRep && passSubcontractor && passTeamMember;
      });
    });

    this.projectStatuses = copiedStatuses;
  }


  redirect(item: any, projectType: string) {
    if (projectType.toLowerCase() == 'job') {
      this.router.navigate([`jobs/${item.id}/logbook`])
    }
    else if (projectType.toLowerCase() == 'contact') {
      this.router.navigate([`contact/${item.id}`])

    }
    else if (projectType.toLowerCase() == 'workorder') {
      this.router.navigate(
        ['/jobs', item.jobId, 'workorder'],
        { queryParams: { id: item.id } }
      );
    }
    else {
      return
    }
  }

  formatWorkOrderTitle(title: string, item: any): string {
    if (!title || !item) {
      return title;
    }
    const placeholder1 = '{{workOrderPriority}}';
    const value1 = item.workOrderPriority;
    title = title.replace(placeholder1, value1 || '');

    const placeholder2 = '{{name}}';
    const value2 = item.name;
    title = title.replace(placeholder2, value2 || '');

    const placeholder3 = '{{workOrderStatus}}';
    const value3 = item.workOrderStatus;
    title = title.replace(placeholder3, value3 || '');

    const placeholder4 = '{{startDate}}';
    const value4 = item.startDate ? new Date(item.startDate).toLocaleDateString() : '';
    title = title.replace(placeholder4, value4);

    const placeholder5 = '{{dueDate}}';
    const value5 = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '';
    title = title.replace(placeholder5, value5);

    const placeholder6 = '{{notes}}';
    const value6 = item.notes;
    title = title.replace(placeholder6, value6 || '');

    const placeholder7 = '{{lastStatusChangeDate}}';
    const value7 = item.lastStatusChangeDate ? new Date(item.lastStatusChangeDate).toLocaleDateString() : '';
    title = title.replace(placeholder7, value7);

    return title;
  }

  formatContactTitle(title: string, contact: any): string {
    if (!title || !contact) {
      return title;
    }

    // Replace firstName
    const placeholder1 = '{{firstName}}';
    const value1 = contact.firstName;
    title = title.replace(placeholder1, value1 || '');

    // Replace lastName
    const placeholder2 = '{{lastName}}';
    const value2 = contact.lastName;
    title = title.replace(placeholder2, value2 || '');

    // Replace company
    const placeholder3 = '{{company}}';
    const value3 = contact.company;
    title = title.replace(placeholder3, value3 || '');

    // Replace addressLine1
    const placeholder4 = '{{addressLine1}}';
    const value4 = contact.addressLine1;
    title = title.replace(placeholder4, value4 || '');

    // Replace addressLine2
    const placeholder5 = '{{addressLine2}}';
    const value5 = contact.addressLine2;
    title = title.replace(placeholder5, value5 || '');

    // Replace city
    const placeholder6 = '{{city}}';
    const value6 = contact.city;
    title = title.replace(placeholder6, value6 || '');

    // Replace zipCode
    const placeholder7 = '{{zipCode}}';
    const value7 = contact.zipCode;
    title = title.replace(placeholder7, value7 || '');

    // Replace email
    const placeholder8 = '{{email}}';
    const value8 = contact.email;
    title = title.replace(placeholder8, value8 || '');

    // Replace faxNo
    const placeholder9 = '{{faxNo}}';
    const value9 = contact.faxNo;
    title = title.replace(placeholder9, value9 || '');

    // Replace displayName
    const placeholder10 = '{{displayName}}';
    const value10 = contact.displayName;
    title = title.replace(placeholder10, value10 || '');

    // Replace startDate
    const placeholder11 = '{{startDate}}';
    const value11 = contact.startDate ? new Date(contact.startDate).toLocaleDateString() : '';
    title = title.replace(placeholder11, value11);

    // Replace endDate
    const placeholder12 = '{{endDate}}';
    const value12 = contact.endDate ? new Date(contact.endDate).toLocaleDateString() : '';
    title = title.replace(placeholder12, value12);

    // Replace lastStatusChangeDate
    const placeholder13 = '{{lastStatusChangeDate}}';
    const value13 = contact.lastStatusChangeDate ? new Date(contact.lastStatusChangeDate).toLocaleDateString() : '';
    title = title.replace(placeholder13, value13);

    return title;
  }

  formatJobTitle(title: string, job: any): string {
    debugger
    if (!title || !job) {
      return title;
    }

    // Replace name
    const placeholder1 = '{{name}}';
    const value1 = job.name;
    title = title.replace(placeholder1, value1 || '');

    // Replace address1
    const placeholder2 = '{{address1}}';
    const value2 = job.address1;
    title = title.replace(placeholder2, value2 || '');

    // Replace address2
    const placeholder3 = '{{address2}}';
    const value3 = job.address2;
    title = title.replace(placeholder3, value3 || '');

    // Replace city
    const placeholder4 = '{{city}}';
    const value4 = job.city;
    title = title.replace(placeholder4, value4 || '');

    // Replace faxNo
    const placeholder5 = '{{faxNo}}';
    const value5 = job.faxNo;
    title = title.replace(placeholder5, value5 || '');

    // Replace mobileNo
    const placeholder6 = '{{mobileNo}}';
    const value6 = job.mobileNo;
    title = title.replace(placeholder6, value6 || '');

    // Replace homeNo
    const placeholder7 = '{{homeNo}}';
    const value7 = job.homeNo;
    title = title.replace(placeholder7, value7 || '');

    // Replace officeNo
    const placeholder8 = '{{officeNo}}';
    const value8 = job.officeNo;
    title = title.replace(placeholder8, value8 || '');

    // Replace phoneNo
    const placeholder9 = '{{phoneNo}}';
    const value9 = job.phoneNo;
    title = title.replace(placeholder9, value9 || '');

    // Replace jobType
    const placeholder10 = '{{jobType}}';
    const value10 = job.jobType;
    title = title.replace(placeholder10, value10 || '');

    // Replace note
    const placeholder11 = '{{note}}';
    const value11 = job.note;
    title = title.replace(placeholder11, value11 || '');

    // Replace zip
    const placeholder12 = '{{zip}}';
    const value12 = job.zip;
    title = title.replace(placeholder12, value12 || '');

    // Replace startDate
    const placeholder13 = '{{startDate}}';
    const value13 = job.startDate ? new Date(job.startDate).toLocaleDateString() : '';
    title = title.replace(placeholder13, value13);

    // Replace endDate
    const placeholder14 = '{{endDate}}';
    const value14 = job.endDate ? new Date(job.endDate).toLocaleDateString() : '';
    title = title.replace(placeholder14, value14);

    // Replace lastStatusChangeDate
    const placeholder15 = '{{lastStatusChangeDate}}';
    const value15 = job.lastStatusChangeDate ? new Date(job.lastStatusChangeDate).toLocaleDateString() : '';
    title = title.replace(placeholder15, value15);

    return title;
  }


  openAutomationModal(projectType: string) {
    if (projectType.toLowerCase() == 'job') {
      this.router.navigate([`settings/automation/jobs`])
    }
    else if (projectType.toLowerCase() == 'contact') {
      this.router.navigate([`settings/automation/contacts`])

    }
    else if (projectType.toLowerCase() == 'workorder') {
      this.router.navigate([`settings/automation/workorders`])
      return
    }
    else {
      return
    }

    // const dialogRef = this.dialog.open(AutomationComponent, {
    //   width: '70vw',
    //   // height: '90vh',
    //   data: { id: boardId },
    //   disableClose: true,
    // });

    // dialogRef.afterClosed().subscribe(() => {
    //   this.getBoardById(this.boardId);
    // });

  }
}
