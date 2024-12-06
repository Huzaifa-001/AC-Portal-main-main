import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../app-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomationAndTemplateService {

  constructor(private http: HttpClient) { }

  getAllEmailTemplates(): Observable<any> {
    return this.http.get<any[]>(`${AppConfig.Templates.GetAllEmailTemplates}`);
  }

  getAllSMSTemplates(): Observable<any> {
    return this.http.get<any[]>(`${AppConfig.Templates.GetAllSMSTemplates}`);
  }

  getEmailTemplateById(id: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.Templates.GetEmailTemplateById}?id=${id}`);
  }

  getSMSTemplateById(id: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.Templates.GetSMSTemplateById}?id=${id}`);
  }

  createEmailTemplate(template: any): Observable<any> {
    return this.http.post<any>(`${AppConfig.Templates.CreateEmailTemplate}`, template);
  }

  updateAutomationStatus(template: any): Observable<any> {
    return this.http.post<any>(`${AppConfig.Automation.updateAutomationStatus}`, template);
  }

  createSMSTemplate(template: any): Observable<any> {
    return this.http.post<any>(`${AppConfig.Templates.CreateSMSTemplate}`, template);
  }

  updateEmailTemplate(template: any): Observable<any> {
    return this.http.put<any>(`${AppConfig.Templates.UpdateEmailTemplate}`, template);
  }

  updateSMSTemplate(template: any): Observable<any> {
    return this.http.put<any>(`${AppConfig.Templates.UpdateSMSTemplate}`, template);
  }

  deleteEmailTemplate(id: number): Observable<any> {
    return this.http.delete<any>(`${AppConfig.Templates.DeleteEmailTemplate}?id=${id}`);
  }

  deleteSMSTemplate(id: number): Observable<any> {
    return this.http.delete<any>(`${AppConfig.Templates.DeleteSMSTemplate}?id=${id}`);
  }

  getAllAutomations(): Observable<any> {
    return this.http.get<any>(`${AppConfig.Automation.GetAll}`);
  }

  createAutomation(automation: any): Observable<any> {
    return this.http.post<any>(`${AppConfig.Automation.Create}`, automation);
  }

  updateAutomation(automation: any): Observable<any> {
    return this.http.put<any>(`${AppConfig.Automation.Update}`, automation);
  }

  deleteAutomation(id: number): Observable<any> {
    return this.http.delete<any>(`${AppConfig.Automation.Delete}?id=${id}`);
  }

  getAutomationById(id: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.Automation.GetById}?id=${id}`);
  }
}
