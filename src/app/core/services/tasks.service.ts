import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskDto } from 'src/app/modules/contact/TaskDto';
import { AppConfig } from '../app-config';
import { TaskCreateUpdateRequestDto } from 'src/app/modules/contact/TaskCreateUpdateRequestDto';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  baseUrl = AppConfig.tasks;
  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.baseUrl.allTasks}`);
  }


  getLogsByTaskId(jobId: number): Observable<any> {
    return this.http.get(`${AppConfig.jobsLog.getLogsByTaskId}?taskId=${jobId}`);
  }


  addTask(taskCreateRequest: TaskCreateUpdateRequestDto): Observable<any> {
    return this.http.post(`${this.baseUrl.addTask}`, taskCreateRequest);
  }

  updateTask(taskCreateRequest: TaskCreateUpdateRequestDto): Observable<any> {
    return this.http.put(`${this.baseUrl.updateTask}`, taskCreateRequest);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl.deleteTask}?id=${id}`, {});
  }

  getTasksByRelatedContactId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl.getTasksByRelatedContactId}?id=${id}`, {});
  } 

  getTasksByRelatedJobId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl.getTasksByRelatedJobId}?id=${id}`, {});
  }

  getTaskStatusCountsByJobIdAsync(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl.getTaskStatusCountsByJobIdAsync}?id=${id}`, {});
  }

  getTaskStatusCountsByContactIdAsync(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl.getTaskStatusCountsByContactIdAsync}?id=${id}`, {});
  }

  getTaskStatusCounts(): Observable<any> {
    return this.http.get(`${this.baseUrl.getTaskStatusCounts}`, {});
  }
  
}
