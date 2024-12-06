import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTOProject, DTOProjectInsert } from '../interfaces';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = 'http://40.78.110.204:2005/Api/Projects';

  constructor(private http: HttpClient) { }

  getProjectById(id: number): Observable<any> {
    const url = `${this.baseUrl}/GetProjectById?Id=${id}`;
    return this.http.get(url);
  }

  getAllProjects(dto: any): Observable<any> {
    const queryParams = new HttpParams({ fromObject: dto as any });
    const url = `${this.baseUrl}/GetAllProjects`;
    return this.http.get(url, { params: queryParams });
  }

  createProject(project: DTOProjectInsert): Observable<any> {
    const url = `${this.baseUrl}/CreateProjects`;
    return this.http.post(url, project);
  }

  updateProject(project: DTOProject): Observable<any> {
    const url = `${this.baseUrl}/UpdateProjects`;
    return this.http.post(url, project);
  }

  deleteProject(project: DTOProject): Observable<any> {
    const url = `${this.baseUrl}/DeleteProjects`;
    const options = {
      body: project // Pass the project as the request body
    };
    return this.http.delete(url, options);
  }


  // Boards
  updateWorkorderStatuses(id: string,workFlowId:string,workFlowStatusId: string): Observable<any> {
    const url = `${AppConfig.WorkOrder.updateWorkOrderStatusAndWorkflow}?id=${id}&workflowId=${workFlowId}&statusId=${workFlowStatusId}`;
    return this.http.post(url,{});
  }
  updateContactStatuses(id: string,workFlowId:string,workFlowStatusId: string): Observable<any> {
    const url = `${AppConfig.Contact.updateContactStatusAndWorkflow}?id=${id}&workflowId=${workFlowId}&statusId=${workFlowStatusId}`;
    return this.http.post(url,{});
  }
  updateJobStatuses(id: string,workFlowId:string,workFlowStatusId: string): Observable<any> {
    const url = `${AppConfig.Jobs.updateJobStatusAndWorkflow}?id=${id}&workflowId=${workFlowId}&statusId=${workFlowStatusId}`;
    return this.http.post(url,{});
  }
  getBoardById(id: string): Observable<any> {
    const url = `${AppConfig.Boards.GetBoardById}?Id=${id}`;
    return this.http.get(url);
  }

  getAllBoards(dto: any): Observable<any> {
    const queryParams = new HttpParams({ fromObject: dto as any });
    return this.http.get(AppConfig.Boards.GetAllBoards);
  }

  getBoardStatuses(boardId: string): Observable<any> {
    const url = `${AppConfig.Boards.GetBoardStatuses}?boardId=${boardId}`;
    return this.http.get(url);
  }

  createBoard(board: any): Observable<any> {
    const url = AppConfig.Boards.CreateBoard;
    return this.http.post(url, board);
  }

  updateBoard(board: any): Observable<any> {
    const url = AppConfig.Boards.UpdateBoard;
    return this.http.post(url, board);
  }
  
  updateBoardStatuses(board: any): Observable<any> {
    const url = AppConfig.Boards.UpdateBoardStatuses;
    return this.http.post(url, board);
  }

  deleteBoardStatus(boardId: any): Observable<any> {
    const url = AppConfig.Boards.DeleteBoardStatus+"??boardStatusId="+boardId;
    return this.http.delete(url);
  }

  deleteBoard(boardId: any): Observable<any> {
    const url = AppConfig.Boards.DeleteBoard+ "?boardId="+boardId;
    return this.http.delete(url);
  }

  //Folders
  createFolder(folder: any): Observable<any> {
    const url = AppConfig.Boards.CreateFolder;
    return this.http.post(url, folder);
  }

  updateFolder(folder: any): Observable<any> {
    const url = AppConfig.Boards.UpdateFolder;
    return this.http.post(url, folder);
  }

  deleteFolder(folder: any): Observable<any> {
    const url = AppConfig.Boards.DeleteFolder;
    const options = {
      body: folder // Pass the folder as the request body
    };
    return this.http.delete(url, options);
  }

  moveBoardToFolder(boardId: string, folderId: string): Observable<any> {
    const url = AppConfig.Boards.MoveBoardToFolder;
    const body = {
      boardId: boardId,
      folderId: folderId
    };
    return this.http.post(url, body);
  }

  moveFolderToFolder(sourceFolderId: string, targetFolderId: string): Observable<any> {
    const url = `${AppConfig.Boards.MoveFolderToFolder}?folderId=${sourceFolderId}&parentFolderId=${targetFolderId}`;
    const body = { };
    return this.http.post(url, body);
  }

  getAllFolders(): Observable<any> {
    const url = AppConfig.Boards.GetAllFolders;
    return this.http.get(url);
  }

  getFolderById(id: string): Observable<any> {
    const url = `${AppConfig.Boards.GetFolderById}?id=${id}`;
    return this.http.get(url);
  }

  getAllBoardsAndChildFoldersByParentFolderId(parentFolderId: string): Observable<any> {
    const url = `${AppConfig.Boards.GetAllBoardsAndChildFoldersByParentFolderId}?Id=${parentFolderId}`;
    return this.http.get(url);
  }

  getAllBoardsAndMainFolders(): Observable<any> {
    const url = AppConfig.Boards.GetAllBoardsAndMainFolders;
    return this.http.get(url);
  }

}