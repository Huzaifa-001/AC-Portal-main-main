import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../app-config';
import { CreateContactDto } from 'src/app/modules/contact/CreateContactDto';
import { customFieldDto } from 'src/app/modules/contact/customFieldDto';
import { createNoteDto, updateNoteDto } from 'src/app/modules/contact/createNoteDto';
import { addPhoneNumber, addRelatedContact, updatePhoneNumber, updateRelatedContact } from 'src/app/modules/contact/CreatePhoneNumbersDto';
import { WorkFlowDto } from 'src/app/modules/contact/WorkFlowDto';
import { ContactAnalyticsRequest } from 'src/app/modules/contact/ContactAnalyticsRequest';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  baseUrl = AppConfig.Base_url;
  contactDto: any;

  constructor(private http: HttpClient, private router: Router) { }

  allResult() {
    return this.http.get<any>(this.baseUrl + '/Contact/allContacts');
  }

  //-----------officeLocations

  allOfficeLocations() {
    return this.http.get<any>(
      AppConfig.OfficeLocation.officelocationsdropdown
    );
  }

  //-----------officeLocations
  allSalesRep() {
    return this.http.get<any>(
      AppConfig.SalesRepresentative.getsalesrepresentative
    );
  }

  allWorkFlows() {
    return this.http.get<any>(AppConfig.GlobalWorkFlow.allWorkFlows);
  }

  allStatus() {
    return this.http.get<any>(AppConfig.status.allStatuses);
  }

  allSubcontractors() {
    return this.http.get<any>(
      AppConfig.SubContractor.getsubcontractors
    );
  }

  ///TeamMember/getteammebers
  allTeamMembers() {
    return this.http.get<any>(this.baseUrl + '/TeamMember/getteammebers');
  }
  allSource() {
    return this.http.get<any>(
      this.baseUrl + '/DropDown/allDropDownsList?PageName=addcontact'
    );
  }

  allphoneTypes() {
    return this.http.get<any>(
      this.baseUrl + '/DropDown/allDropDownsList?PageName=addcontact'
    );
  }

  allState() {
    return this.http.get<any>(this.baseUrl + '/States');
  }

  getContactAnalytics(request: ContactAnalyticsRequest): Observable<any> {
    let params = new HttpParams();

    if (request.timeFrame) {
      params = params.set('timeFrame', request.timeFrame);
    }

    if (request.sourceId || request.sourceId == 0) {
      params = params.set('sourceId', request.sourceId.toString());
    }

    return this.http.get(`${this.baseUrl}/Contact/GetContactAnalyticsAsync`, { params });
  }

  //===================================================================
  //-----------
  //---------------------

  createContact(
    contact: CreateContactDto,
    img: any,
    phonesno: any
  ): Observable<any> {
    debugger
    const formData = new FormData();
    // const formData = new FormData();
    // Object.assign(formData, contact);
    if (contact?.id?.toString()) {
      formData.append('id', contact?.id?.toString() ?? '0');
    }
    formData.append('firstName', contact.firstName);
    formData.append('lastName', contact.lastName);
    formData.append('company', contact.company);
    formData.append('addressLine1', contact?.addressLine1?.toString() ?? '');
    formData.append('addressLine2', contact?.addressLine2?.toString() ?? '');
    formData.append('city', contact?.city?.toString() ?? '');
    formData.append('zipCode', contact?.zipCode?.toString() ?? '');
    formData.append('email', contact?.email?.toString() ?? '');
    formData.append('website', contact.website as string);
    formData.append('faxNo', contact?.faxNo?.toString() ?? '');
    formData.append('displayName', contact?.displayName?.toString() ?? '');
    const startDate = contact?.startDate;
    if (startDate !== undefined) {
      const startDateObj = new Date(startDate);
      startDateObj.setDate(startDateObj.getDate() + 1);
      formData.append('startDate', startDateObj.toISOString());
    }
    const endDate = contact?.endDate;
    if (endDate !== undefined) {
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      formData.append('endDate', endDateObj.toISOString());
    }
    formData.append('discription', contact?.discription?.toString() ?? '');
    formData.append('note', contact?.note?.toString() ?? '');
    formData.append('sourceId', contact?.sourceId?.toString() ?? '');
    formData.append('stateId', contact?.stateId?.toString() ?? '');
    formData.append('salesRepId', contact?.salesRepId?.toString() ?? '');
    formData.append(
      'subContractorId',
      contact?.subContractorId?.toString() ?? ''
    );
    contact?.teamMembers?.forEach((id?) =>
      formData.append('teamMembers[]', id?.toString())
    );
    formData.append(
      'officeLocationId',
      contact?.officeLocationId?.toString() ?? ''
    );
    formData.append('workFlowId', contact?.workFlowId?.toString() ?? '');
    formData.append('statusId', contact?.statusId?.toString() ?? '');
    contact?.relatedContacts?.forEach((id) =>
      formData.append('relatedContacts[]', id.toString())
    );
    phonesno?.forEach((phoneNumber: any, index: number) => {
      const keyPrefix = `phoneNumbers[${index}]`;
      formData.append(`${keyPrefix}.phoneNumber`, phoneNumber.phoneNumber);
      formData.append(`${keyPrefix}.typeId`, phoneNumber.typeId);
      formData.append(`${keyPrefix}.id`, phoneNumber.id ?? '0');
    });
    if (contact.tags) {
      contact.tags.forEach((tag: any) => formData.append('tags[]', tag.value));
    }
    if (img != null) {
      formData.append('file', img, img.name);
    }
    if (contact?.id?.toString()) {
      return this.http.put<any>(
        this.baseUrl + '/Contact/updateContact',
        formData
      );
    } else {
      return this.http.post<any>(
        this.baseUrl + '/Contact/addContact',
        formData
      );
    }
  }

  getContactById(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/Contact/getContactById?Id=' + id
    );
  }

  getPagedContacts(
    pageIndex: number,
    pageSize: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/Contact/PagedContacts?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllLocations(sort: string, search: string) {
    return this.http.get<any>(
      this.baseUrl + '/OfficeLocation/allOfficeLocations?Sort=' + sort + '&Search=' + search
    );
  }

  deleteContact(id: any) {
    return this.http.put<any>(
      this.baseUrl + '/Contact/deleteContact?id=' + id, {}
    );
  }

  //Custom Fields
  addCustomField(customField: customFieldDto): Observable<any> {
    const formData = new FormData();
    if (customField?.contactId?.toString()) {
      formData.append('id', customField?.contactId?.toString() ?? '0');
    }
    formData.append('customFieldName', customField.customFieldName);
    formData.append('value', customField.value);

    if (customField?.contactId?.toString()) {
      return this.http.put<any>(
        this.baseUrl + '/CustomField/updateCustomField',
        formData
      );
    } else {
      return this.http.post<any>(
        this.baseUrl + '/CustomField/addCustomField',
        formData
      );
    }
  }


  deleteCustomField(customField: customFieldDto): Observable<any> {
    const formData = new FormData();
    formData.append('id', customField?.contactId?.toString() ?? '0');
    formData.append('customFieldName', customField.customFieldName);
    formData.append('value', customField.value);

    return this.http.put<any>(
      this.baseUrl + '/CustomField/deleteCustomField',
      formData
    );
  }

  getCustomFieldById(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/CustomField/getCustomFieldById?Id=' + id
    );
  }

  getCustomFieldByContactId(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/CustomField/getCustomFieldByContactId?Id=' + id
    );
  }

  getPagedCustomFields(
    pageIndex: number,
    pageSize: number,
    ContactId: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/CustomField/PagedCustomField?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&ContactId=' +
      ContactId +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllCustomFields(sort: string, search: string) {
    return this.http.get<any>(
      this.baseUrl +
      '/CustomField/allCustomFields?Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  // Files
  uploadMultipleFiles(Files: any, ContactId: number) {
    const formData = new FormData();
    formData.append('Files', Files?.toString() ?? '0');
    formData.append('ContactId', ContactId?.toString() ?? '0');
    return this.http.get<any>(this.baseUrl + '/File/uploadFiles' + formData);
  }

  uploadFile(File: any, ContactId: number, IsProfile: boolean) {
    const formData = new FormData();
    formData.append('File', File?.toString() ?? '0');
    formData.append('ContactId', ContactId?.toString() ?? '0');
    formData.append('IsProfile', IsProfile?.toString() ?? '0');
    return this.http.get<any>(this.baseUrl + '/File/uploadFiles' + formData);
  }

  deleteFilesByMasterId(id: number): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + '/File/deleteFileByMasterId?Id=',
      id
    );
  }

  deleteFilesByDerivedId(id: number): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + '/File/deleteFileByDerivedId?Id=',
      id
    );
  }

  getAllFiles() {
    return this.http.get<any>(this.baseUrl + '/File/allFiles');
  }

  //Notes
  addNewNote(note: createNoteDto) {
    const formData = new FormData();
    formData.append('note', note?.note?.toString() ?? '0');
    formData.append('typeId', note?.typeId?.toString() ?? '0');
    formData.append('contactId', note?.contactId?.toString() ?? '0');

    return this.http.post<any>(this.baseUrl + '/Note/addNote', formData);
  }

  updateNote(note: updateNoteDto) {
    const formData = new FormData();
    formData.append('note', note?.note?.toString() ?? '0');
    formData.append('typeId', note?.typeId?.toString() ?? '0');
    formData.append('contactId', note?.id?.toString() ?? '0');
    return this.http.put<any>(this.baseUrl + '/Note/updateNote', formData);
  }

  deleteNote(id: number) {
    return this.http.put<any>(this.baseUrl + '/Note/deleteNote?Id=', id);
  }

  getNoteById(id: number) {
    return this.http.get<any>(this.baseUrl + '/Note/getNoteById?Id=' + id);
  }

  getNoteByContactId(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/Note/getNoteByContactId?Id=' + id
    );
  }

  getPagedNote(
    pageIndex: number,
    pageSize: number,
    ContactId: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/Note/PagedNotes?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&ContactId=' +
      ContactId +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllNotes(sort: string, search: string) {
    return this.http.get<any>(
      this.baseUrl + '/Note/allNotes?Sort=' + sort + '&Search=' + search
    );
  }

  // Phone Number

  addPhoneNumber(phone: addPhoneNumber): Observable<any> {
    const formData = new FormData();
    if (phone?.contactId?.toString()) {
      formData.append('contactId', phone?.contactId?.toString() ?? '0');
    }
    formData.append('phoneNumber', phone?.phoneNumber?.toString() ?? '0');
    formData.append('typeId', phone?.typeId?.toString() ?? '0');
    return this.http.post<any>(
      this.baseUrl + '/PhoneNumber/addPhoneNumber',
      formData
    );
  }

  updatePhoneNumber(phone: updatePhoneNumber): Observable<any> {
    const formData = new FormData();
    if (phone?.id?.toString()) {
      formData.append('contactId', phone?.id?.toString() ?? '0');
    }
    formData.append('phoneNumber', phone?.phoneNumber?.toString() ?? '0');
    formData.append('typeId', phone?.typeId?.toString() ?? '0');

    return this.http.put<any>(
      this.baseUrl + '/PhoneNumber/updatePhoneNumber',
      formData
    );
  }

  deletePhoneNumber(id: number) {
    const formData = new FormData();
    formData.append('id', id?.toString() ?? '0');
    return this.http.put<any>(
      this.baseUrl + '/PhoneNumber/deletePhoneNumber',
      formData
    );
  }

  getPhoneNumberById(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/PhoneNumber/getPhoneNumberById?Id=' + id
    );
  }

  getPhoneNumberByContactId(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/PhoneNumber/getPhoneNumbersByContactId?Id=' + id
    );
  }

  getPagedPhoneNumber(
    pageIndex: number,
    pageSize: number,
    ContactId: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/PhoneNumber/PagedPhoneNumbers?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&ContactId=' +
      ContactId +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllPhoneNumbers(sort: string, search: string) {
    return this.http.get<any>(
      this.baseUrl +
      '/PhoneNumber/allPhoneNumbers?Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  // Related Contacts

  addRelatedContact(rContact: addRelatedContact): Observable<any> {
    const formData = new FormData();
    formData.append('contactId', rContact?.contactId?.toString() ?? '0');
    formData.append(
      'relatedContactIds',
      rContact?.relatedContactIds?.toString() ?? '0'
    );

    return this.http.post<any>(
      this.baseUrl + '/RelatedContact/addRelatedContact',
      formData
    );
  }

  updateRelatedContact(rContact: updateRelatedContact): Observable<any> {
    const formData = new FormData();
    formData.append('contactId', rContact?.contactId?.toString() ?? '0');
    formData.append(
      'relatedContactId',
      rContact?.relatedContactId?.toString() ?? '0'
    );
    formData.append('id', rContact?.id?.toString() ?? '0');

    return this.http.put<any>(
      this.baseUrl + '/RelatedContact/updateRelatedContact',
      formData
    );
  }

  deleteRelatedContact(id: number) {
    return this.http.put<any>(
      this.baseUrl + '/RelatedContact/deleteRelatedContact?Id=',
      id
    );
  }

  getRelatedContactsById(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/RelatedContact/getRelatedContactsById?Id=' + id
    );
  }

  getRelatedContactsByContactId(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/RelatedContact/getRelatedContactsByContactId?Id=' + id
    );
  }

  getPagedRelatedContacts(
    pageIndex: number,
    pageSize: number,
    ContactId: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/RelatedContact/getPagedRelatedContacts?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&ContactId=' +
      ContactId +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllRelatedContacts(sort: string, search: string) {
    return this.http.get<any>(
      this.baseUrl +
      '/RelatedContact/allRelatedContacts?Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getRelatedContactsByCompanyId(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/RelatedContact/getRelatedContactsByCompanyId?Id=' + id
    );
  }

  getRelatedContactsDropDown() {
    return this.http.get<any>(
      this.baseUrl + '/RelatedContact/getRelatedContactsDropDown'
    );
  }

  // Status

  addStatus(statusName: string, workFlowId: number) {
    const formData = new FormData();

    formData.append('statusName', statusName?.toString() ?? '');
    formData.append('workFlowId', workFlowId?.toString() ?? '0');

    return this.http.post<any>(this.baseUrl + '/Status/addStatus', formData);
  }

  updateStatus(statusName: string, workFlowId: number, id: number) {
    const formData = new FormData();

    formData.append('statusName', statusName?.toString() ?? '');
    formData.append('workFlowId', workFlowId?.toString() ?? '0');
    formData.append('id', id?.toString() ?? '0');

    return this.http.post<any>(this.baseUrl + '/Status/updateStatus', formData);
  }

  deleteStatus(id: number) {
    return this.http.put<any>(this.baseUrl + '/Status/deleteStatus?Id=', id);
  }

  getStatusById(id: number) {
    return this.http.get<any>(this.baseUrl + '/Status/getStatusById?Id=' + id);
  }

  getStatusesByWorkFlowId(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/Status/getStatusesByWorkFlowId?Id=' + id
    );
  }

  getPagedStatuses(
    pageIndex: number,
    pageSize: number,
    WorkFlowId: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/Status/PagedStatuses?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&WorkFlowId=' +
      WorkFlowId +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllStatuses(sort: string, search: string) {
    return this.http.get<any>(
      this.baseUrl + '/Status/allStatuses?Sort=' + sort + '&Search=' + search
    );
  }

  // Tag

  addTag(tag: string, contactId: number) {
    const formData = new FormData();

    formData.append('tag', tag?.toString() ?? '');
    formData.append('contactId', contactId?.toString() ?? '0');
    return this.http.post<any>(this.baseUrl + '/Tag/addTag', formData);
  }

  updateTag(tag: string, id: number) {
    const formData = new FormData();

    formData.append('tag', tag?.toString() ?? '');
    formData.append('id', id?.toString() ?? '0');
    return this.http.put<any>(this.baseUrl + '/Tag/updateTag', formData);
  }

  deleteTag(id: number) {
    const formData = new FormData();
    formData.append('id', id?.toString() ?? '0');
    return this.http.put<any>(this.baseUrl + '/Tag/deleteTag', formData);
  }

  getTagById(id: number) {
    return this.http.get<any>(this.baseUrl + '/Tag/getTagById?Id=' + id);
  }

  getTagsByContactId(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/Tag/getTagsByContactId?Id=' + id
    );
  }

  getPagedTags(
    pageIndex: number,
    pageSize: number,
    ContactId: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/Status/PagedTags?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&ContactId=' +
      ContactId +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllTags(sort: string, search: string) {
    return this.http.get<any>(
      this.baseUrl + '/Status/allTags?Sort=' + sort + '&Search=' + search
    );
  }

  // Workflow

  addWorkFlow(workflow: WorkFlowDto): Observable<any> {
    const formData = new FormData();
    formData.append('workFlowName', workflow?.workFlowName?.toString() ?? '');
    formData.append('isVisible', workflow?.isVisible?.toString() ?? '');
    formData.append('isAccessable', workflow?.isAccessable?.toString() ?? '');

    return this.http.post<any>(
      this.baseUrl + '/WorkFlow/addWorkFlow',
      formData
    );
  }

  updateWorkFlow(workflow: WorkFlowDto, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('workFlowName', id?.toString() ?? '0');
    formData.append('workFlowName', workflow?.workFlowName?.toString() ?? '');
    formData.append('isVisible', workflow?.isVisible?.toString() ?? '');
    formData.append('isAccessable', workflow?.isAccessable?.toString() ?? '');

    return this.http.post<any>(
      this.baseUrl + '/WorkFlow/updateWorkFlow',
      formData
    );
  }

  deleteWorkFlow(id: number) {
    const formData = new FormData();
    formData.append('id', id?.toString() ?? '0');
    return this.http.put<any>(
      this.baseUrl + '/WorkFlow/deleteWorkFlow',
      formData
    );
  }

  getWorkFlowById(id: number) {
    return this.http.get<any>(
      this.baseUrl + '/WorkFlow/getWorkFlowById?Id=' + id
    );
  }

  getPagedWorkFlows(
    pageIndex: number,
    pageSize: number,
    WorkFlowId: number,
    sort: string,
    search: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      '/WorkFlow/PagedWorkFlows?PageIndex=' +
      pageIndex +
      '&PageSize=' +
      pageSize +
      '&WorkFlowId=' +
      WorkFlowId +
      '&Sort=' +
      sort +
      '&Search=' +
      search
    );
  }

  getAllWorkFlows(sort: string, search: string, WorkFlowId: number) {
    return this.http.get<any>(
      this.baseUrl +
      '/WorkFlow/allWorkFlows?Sort=' +
      sort +
      '&Search=' +
      search +
      '&WorkFlowId=' +
      WorkFlowId
    );
  }
}
