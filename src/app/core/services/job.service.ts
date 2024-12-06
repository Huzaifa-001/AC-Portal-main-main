import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { AppConfig } from '../app-config';
import { UtilityService } from './shared/UtilityService';
import { JobDTO, Workflow } from '../interfaces';
import { EventDTO } from 'src/app/modules/job/createEventDto';
import { createJobStatusDto } from 'src/app/modules/job/createJobStatusDto';
import { createLeadSourceDto } from 'src/app/modules/job/createLeadSourceDto';
import { createTagDto } from 'src/app/modules/job/createTagDto';
import { createWorkOrderDto } from 'src/app/modules/job/createWorkOrderDto';
import { createWorkflowDto } from 'src/app/modules/job/createWorkflowDto';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ContactAnalyticsRequest } from 'src/app/modules/contact/ContactAnalyticsRequest';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  baseUrl = AppConfig.Base_url;
  private subject = new Subject<boolean>();

  constructor(
    private utilityService: UtilityService,
    private http: HttpClient
  ) { }

  emitValue(value: boolean) {
    this.subject.next(value);
  }

  subscribeToValue(callback: (value: boolean) => void) {
    this.subject.subscribe(callback);
  }

  //-----------Office Locations
  allOfficeLocations() {
    return this.http.get<any>(AppConfig.OfficeLocation.allOfficeLocations);
  }

  allSalesRep() {
    return this.http.get<any>(
      AppConfig.SalesRepresentative.getsalesrepresentative
    );
  }

  getJobsAnalytics(request: ContactAnalyticsRequest): Observable<any> {
    let params = new HttpParams();

    if (request.timeFrame) {
      params = params.set('timeFrame', request.timeFrame);
    }

    if (request.sourceId || request.sourceId == 0) {
      params = params.set('sourceId', request.sourceId.toString());
    }

    return this.http.get(`${this.baseUrl}/Jobs/GetJobAnalytics`, { params });
  }



  allStatus() {
    return this.http.get<any>(AppConfig.status.allStatuses);
  }

  SearchAll(name: string) {
    return this.http.get<any>(`${AppConfig.Jobs.SearchAll}?name=${name}`);
  }

  allSubcontractors() {
    return this.http.get<any>(AppConfig.SubContractor.getsubcontractors);
  }

  allRelatedContacts() {
    return this.http.get<any>(AppConfig.RelatedContact.getRelatedContactsDropDown);
  }

  ///TeamMember/getteammebers
  allTeamMembers() {
    return this.http.get<any>(AppConfig.TeamMember.getteammebers);
  }

  allphoneTypes() {
    return this.http.get<any>(
      AppConfig.DropDown.allDropDownsList + '?PageName=addcontact'
    );
  }

  allSource() {
    return this.http.get<any>(
      AppConfig.DropDown.allDropDownsList + '?PageName=addcontact'
    );
  }

  allState() {
    return this.http.get<any>(AppConfig.States);
  }

  //Job Requests

  //---------Get Jobs
  getAllJob() {
    return this.http.get<any>(AppConfig.Jobs.GetAllJob);
  }

  //Get Job By ID
  getJobByID(id: number) {
    return this.http.get<any>(AppConfig.Jobs.GetJobById + '?id=' + id);
  }

  //get all jobs by company ID
  getAllJobsByCompanyID() {
    return this.http.get<JobDTO[]>(AppConfig.Jobs.GetAllJobByCompanyId);
  }

  //get all jobs with pagination
  getAllJobsWithPagination(dto: any) {
    const queryParams = new HttpParams({ fromObject: dto as any });
    return this.http.get<any>(
      AppConfig.Jobs.GetAllJobWithPagination, { params: queryParams }
    );
  }

  //----------Add Jobs
  createJob(requestBody: JobDTO, phonesno: any): Observable<any> {
    return this.http.post<any>(AppConfig.Jobs.CreateJob, requestBody);
  }

  updateJob(requestBody: JobDTO, phonesno: any): Observable<any> {
    return this.http.post<any>(AppConfig.Jobs.UpdateJob, requestBody, {
      params: { id: requestBody.id },
    });
  }

  deleteJob(Jobs: any) {
    return this.http.delete<any>(AppConfig.Jobs.DeleteJob, { body: Jobs });
  }

  //Events Requests

  getEventById(id: number) {
    return this.http.get<any>(AppConfig.Events.GetEventById, {
      params: { id: id },
    });
  }

  getAllEvents() {
    return this.http.get<any>(AppConfig.Events.GetAllEvent);
  }

  createEvent(Event: EventDTO): Observable<any> {
    if (Event?.id?.toString()) {
      return this.http.post<any>(AppConfig.Events.UpdateEvent, Event);
    } else {
      return this.http.post<any>(AppConfig.Events.CreateEvent, Event);
    }
  }

  deleteEvent(Event: EventDTO): Observable<any> {
    return this.http.delete<any>(AppConfig.Events.DeleteEvent, { body: Event });
  }


  getEventsByJobId(id: number) {
    return this.http.get<any>(AppConfig.Events.GetEventsByJobId, {
      params: { jobId: id },
    });
  }

  // JOB status requests

  getJobStatusByID(id: number) {
    return this.http.get<any>(AppConfig.Events.GetJobsStatusById, {
      params: { Id: id },
    });
  }

  getAllJobStatus() {
    return this.http.get<any>(AppConfig.Events.GetAllJobsStatus);
  }

  createJobStatus(jobStatus: createJobStatusDto): Observable<any> {
    const formData = new FormData();
    formData.append('id', jobStatus?.id?.toString() ?? '');
    formData.append('userId', jobStatus?.userId?.toString() ?? '');
    formData.append('createdBy', jobStatus?.createdBy?.toString() ?? '');
    formData.append('modifiedBy', jobStatus?.modifiedBy?.toString() ?? '');
    formData.append('companyId', jobStatus?.companyId?.toString() ?? '');
    const startDate = jobStatus?.createdDate;
    if (startDate !== undefined) {
      const startDateObj = new Date(startDate);
      startDateObj.setDate(startDateObj.getDate() + 1);
      formData.append('startDate', startDateObj.toISOString());
    }
    const modifiedDate = jobStatus?.modifiedDate;
    if (modifiedDate !== undefined) {
      const modifiedDateObj = new Date(modifiedDate);
      modifiedDateObj.setDate(modifiedDateObj.getDate() + 1);
      formData.append('endDate', modifiedDateObj.toISOString());
    }
    formData.append('jobStatus', jobStatus?.jobStatus?.toString() ?? '');
    formData.append('jobStaus', jobStatus?.jobStaus?.toString() ?? '');
    formData.append('isDeleted', jobStatus?.isDeleted?.toString() ?? '');

    if (jobStatus?.id?.toString()) {
      const url = AppConfig.JobStatus.CreateJobStatus;
      return this.http.put<any>(url, formData);
    } else {
      const url = AppConfig.JobStatus.UpdateJobStatus;
      const params = { Id: jobStatus?.id?.toString() };
      return this.http.post<any>(url, formData, { params });
    }
  }

  // Lead Source

  getLeadSourceById(id: number): Observable<any> {
    const url = `${AppConfig.LeadSource.GetLeadSourceById}/${id}`;
    return this.http.get<any>(url);
  }

  getAllLeadSource(): Observable<any> {
    const url = AppConfig.LeadSource.GetAllLeadSource;
    return this.http.get<any>(url);
  }

  createLeadSource(leadSource: createLeadSourceDto): Observable<any> {
    const formData = new FormData();
    formData.append('jobId', leadSource?.jobId?.toString() ?? '');
    formData.append('name', leadSource?.name?.toString() ?? '');

    if (leadSource.jobId?.toString()) {
      const url = `${AppConfig.LeadSource.CreateLeadSource}/${leadSource.jobId}`;
      return this.http.put<any>(url, formData);
    } else {
      const url = AppConfig.LeadSource.CreateLeadSource;
      const params = { id: leadSource.jobId?.toString() };
      return this.http.post<any>(url, formData, { params });
    }
  }

  //Tags
  getAllTag() {
    return this.http.get<any>(AppConfig.Tags.GetAllTag);
  }

  createTag(tag: createTagDto): Observable<any> {
    const formData = new FormData();
    formData.append('jobId', tag?.jobId?.toString() ?? '');
    formData.append('name', tag?.name?.toString() ?? '');

    if (tag.jobId?.toString()) {
      const url = AppConfig.Tags.CreateTag;
      return this.http.put<any>(url, formData);
    } else {
      const url = AppConfig.Tags.UpdateTag;
      const jobIdParam = tag?.jobId?.toString() ?? '';
      const params = { Id: jobIdParam };
      return this.http.post<any>(url, formData, { params });
    }
  }

  // Work Order
  getWorkOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.WorkOrder.GetWorkOrderById}?id=${id}`);
  }

  getAllWorkOrder(): Observable<any> {
    return this.http.get<any>(AppConfig.WorkOrder.GetAllWorkOrder);
  }

  GetWorkOrderByJobId(id: any): Observable<any> {
    return this.http.get<any>(`${AppConfig.WorkOrder.GetWorkOrderByJobId}?JobId=${id}`);
  }

  GetPaginatedWorkOrderByJobId(id: any, pageNumber, pageSize): Observable<any> {
    const dto = {
      JobId: id,
      PageNumber: pageNumber,
      pageSize: pageSize,
    };
    const queryParams = new HttpParams({ fromObject: dto as any });
    return this.http.get<any>(`${AppConfig.WorkOrder.GetWorkOrderByJobId}`, { params: queryParams });
  }

  deleteWorkOrder(data): Observable<any> {

    return this.http.delete<any>(`${AppConfig.WorkOrder.DeleteWorkOrder}?workOrderId=${data}`);
  }

  createWorkOrder(workOrder: createWorkOrderDto): Observable<any> {
    workOrder.lastStatusChangeDate = new Date().toISOString();
    return this.http.post<any>(AppConfig.WorkOrder.CreateWorkOrder, workOrder);
  }

  updateWorkOrder(workOrder: createWorkOrderDto): Observable<any> {
    workOrder.lastStatusChangeDate = new Date().toISOString();
    return this.http.post<any>(AppConfig.WorkOrder.UpdateWorkOrder, workOrder);
  }

  //WorkFlow
  getWorkFlowById(id: number): Observable<any> {
    const url = `${AppConfig.WorkFlow.GetjobWorkFlowById}`;
    return this.http.get<any>(url, { params: { id: id.toString() } });
  }

  getAllWorkFlows(): Observable<any> {
    const url = AppConfig.WorkFlow.alljobWorkFlows;
    return this.http.get<any>(url);
  }

  createWorkflow(workFlow: any): Observable<any> {
    if (workFlow.id?.toString()) {
      const url = `${AppConfig.WorkFlow.UpdatejobWorkFlow}/${workFlow.id}`;
      return this.http.put<any>(url, workFlow);
    } else {
      const url = AppConfig.WorkFlow.CreatejobWorkFlow;
      return this.http.post<any>(url, workFlow);
    }
  }

  allWorkFlows() {
    return this.http.get<any>(AppConfig.WorkFlow.alljobWorkFlows);
  }

  statusByWorkflowId(id: any) {
    return this.http.get<any>(AppConfig.status.getStatusesByWorkFlowId + '?id=' + id);
  }

  //  ------------------------------Photos and Attachments


  getJobAttachmentById(id: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.JobAttachments.GetAttachmentById}?Id=${id}`);
  }

  downloadFiles(fileNames: string[]): Observable<any> {
    const url = `${AppConfig.Photos.DownloadFiles}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, responseType: 'blob' as 'json' };
    return this.http.post(url, fileNames, options);
  }

  getJobAttachmentsByJobId(jobId: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.JobAttachments.GetAttachmentByJobId}?Id=${jobId}`);
  }

  getAllJobAttachments(): Observable<any> {
    return this.http.get<any>(AppConfig.JobAttachments.GetAllAttachments);
  }

  createJobAttachment(formData: FormData): Observable<any> {
    return this.http.post<any>(AppConfig.JobAttachments.CreateAttachment, formData);
  }

  updateJobAttachment(formData: FormData): Observable<any> {
    return this.http.put<any>(AppConfig.JobAttachments.UpdateAttachment, formData);
  }

  deleteJobAttachment(attachmentId: number): Observable<any> {
    return this.http.delete<any>(`${AppConfig.JobAttachments.DeleteAttachment}?attachmentId=${attachmentId}`);
  }

  getPhotoById(id: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.Photos.GetPhotoById}?Id=${id}`);
  }

  getPhotosByJobId(jobId: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.Photos.GetPhotosByJobId}?Id=${jobId}`);
  }

  getAllPhotos(): Observable<any> {
    return this.http.get<any>(AppConfig.Photos.GetAllPhotos);
  }

  addJobPhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(AppConfig.Photos.AddJobPhoto, formData);
  }

  updateJobPhoto(formData: FormData): Observable<any> {
    return this.http.put<any>(AppConfig.Photos.UpdateJobPhoto, formData);
  }

  deleteJobPhoto(attachmentId: number): Observable<any> {
    return this.http.delete<any>(`${AppConfig.Photos.DeleteJobPhoto}?attachmentId=${attachmentId}`);
  }

  getNoteById(id: number): Observable<any> {
    return this.http.get<any>(`${AppConfig.Notes.GetNoteById}?Id=${id}`);
  }

  getAllNotes(): Observable<any> {
    return this.http.get<any>(AppConfig.Notes.GetAllNotes);
  }

  createNote(formData: FormData): Observable<any> {
    return this.http.post<any>(AppConfig.Notes.CreateNote, formData);
  }

  updateNote(formData: FormData): Observable<any> {
    return this.http.put<any>(AppConfig.Notes.UpdateNote, formData);
  }

  deleteNote(noteId: number): Observable<any> {
    return this.http.delete<any>(`${AppConfig.Notes.DeleteNote}?Id=${noteId}`);
  }

  getLogById(id: number): Observable<any> {
    return this.http.get(`${AppConfig.jobsLog.getLogById}?id=${id}`);
  }

  getAllLogs(): Observable<any> {
    return this.http.get(`${AppConfig.jobsLog.getAllLogs}`);
  }

  getLogsByJobId(jobId: number): Observable<any> {
    return this.http.get(`${AppConfig.jobsLog.getLogsByJobId}?jobId=${jobId}`);
  }

  getLogsByWorkOrderId(jobId: number): Observable<any> {
    return this.http.get(`${AppConfig.jobsLog.getLogsByWorkOrderId}?workOrderId=${jobId}`);
  }
  
  deleteLog(logbookEntry: any): Observable<any> {
    return this.http.delete(`${AppConfig.jobsLog.deleteLog}`, { body: logbookEntry });
  }

  getUserActivityLogs(): Observable<any> {
    return this.http.get(`${AppConfig.jobsLog.getUserActivityLogs}`);
  }

}
