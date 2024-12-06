import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddBoardComponent } from '../add-board/add-board.component';
import { ProjectService } from 'src/app/core/services/project.service';
import { Subscription } from 'rxjs';
import { Board } from '../BoardsInterfaces';
import { Router } from '@angular/router';
import { AddFolderComponent } from '../add-folder/add-folder.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit, OnDestroy {


  boards: Board[] = [];
  subscription: Subscription[] = []
  folders: any[] = [];
  currentFolderId: any;
  draggedFolderId: any;
  previousFolderId: any;
  tempFolders: any[] = [];
  isMainFolder: boolean;

  constructor(private dialog: MatDialog, private projectService: ProjectService, private router: Router) { }

  ngOnInit() {
    this.currentFolderId = 0
    this.loadBoards();
  }

  loadBoards() {
    this.subscription.push(this.projectService.getAllBoardsAndMainFolders().subscribe(
      {
        next: (res) => {
          this.boards = res.boardsData
          this.folders = res.folderData
          this.isMainFolder = true;
        },
        error: (error) => {

        }
      }
    ))
  }

  loadFoldersBoardAndChildFolders(folderId: any) {
    if (this.isMainFolder && (folderId == 0 || folderId == null || folderId == undefined)) {
      return
    }
    else if (folderId == 0) {
      this.loadBoards()
    }
    else {
      this.subscription.push(this.projectService.getAllBoardsAndChildFoldersByParentFolderId(folderId).subscribe(
        {
          next: (res) => {
            this.folders = []
            this.boards = []
            this.currentFolderId = folderId
            this.previousFolderId = res.parentFolderId
            this.boards = res.boardsData
            this.folders = res.folderData
            console.log(res);
            this.isMainFolder = false
          },
          error: (error) => {
            this.currentFolderId = this.previousFolderId
          }
        }
      ))
    }
  }

  openBoardsModal(data: any = null): void {
    if (data == null) {
      data = {
        FormTitle: 'Add Board',
        Request_Type: 'Add',
        folderId: this.currentFolderId ?? 0
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
      if (this.currentFolderId && this.currentFolderId > 0) {
        this.loadFoldersBoardAndChildFolders(this.currentFolderId)
      } else {
        this.loadBoards();
      }
    });
  }

  openFoldersModal(data: any = null): void {
    if (data == null) {
      data = {
        FormTitle: 'Add Folder',
        Request_Type: 'Add',
        parentFolderId: this.currentFolderId ?? 0
      };
    } else {
      data.FormTitle = 'Update Folder';
      data.Request_Type = 'Save';
      data.parentFolderId = data.parentFolderId ?? this.currentFolderId ?? 0
    }

    const dialogRef = this.dialog.open(AddFolderComponent, {
      width: '450px',
      height: '500px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.currentFolderId && this.currentFolderId > 0) {
        this.loadFoldersBoardAndChildFolders(this.currentFolderId)
      } else {
        this.loadBoards();
      }
    });
  }

  goToBoard(id: number) {
    // Navigate to the details route with the ID in the route parameter
    this.router.navigate(['/boards', id]);
  }

  onDragDrop(event: CdkDragDrop<any>, parentFolderId: number): void {
    const folder = event.item.data;
    this.subscription.push(this.projectService.moveFolderToFolder(folder.toString(), parentFolderId.toString()).subscribe(
      {
        next: (res) => {
          console.log(res)
          this.currentFolderId != 0 ? this.loadFoldersBoardAndChildFolders(this.currentFolderId) : this.loadBoards();
        },
        error: (error) => {
          this.currentFolderId = 0
        }
      }
    ))

    console.log('Moved Folder with id', folder, 'to folder', parentFolderId);
  }


  //ondestroy
  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe())
  }
}