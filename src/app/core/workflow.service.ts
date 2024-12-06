import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './app-config';
import { HttpClient } from '@angular/common/http';
import { WorkFlowType, Workflow } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private http: HttpClient) { }

    //WorkFlow
    getWorkFlowById(id: number): Observable<any> {
      const url = `${AppConfig.GlobalWorkFlow.getWorkFlowById}/${id}`;
      return this.http.get<any>(url, { params: { id: id.toString() } });
    }

    deleteWorkFlow(id: number): Observable<any> {
      const url = `${AppConfig.GlobalWorkFlow.deleteWorkFlow}/?id=${id}`;
      return this.http.put<any>(url,{});
    }

    getWorkFlowByType(type: WorkFlowType): Observable<any> {
      const url = `${AppConfig.GlobalWorkFlow.allWorkFlowsByType}`;
      return this.http.get<any>(url, { params: { workFlowParams: type.toString() } });
    }
  
    getAllWorkFlows(): Observable<any> {
      const url = AppConfig.GlobalWorkFlow.allWorkFlows;
      return this.http.get<any>(url);
    }
  
    createWorkflow(workFlow: Workflow): Observable<any> {
      if (workFlow.id > 0) {
        const url = `${AppConfig.GlobalWorkFlow.updateWorkFlow}`;
        return this.http.put<any>(url, workFlow);
      } else {
        const url = AppConfig.GlobalWorkFlow.addWorkFlow;
        return this.http.post<any>(url, workFlow);
      }
    }
  
    getPagedWorkFlow() {
      return this.http.get<any>(AppConfig.GlobalWorkFlow.PagedWorkFlows);
    }
}
