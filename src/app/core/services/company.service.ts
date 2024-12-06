import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor() {}

  // Company

  // pagedCompanies(pageIndex: number, pageSize: number, sort: string, search: string) {
  //   return this.http.get<any>(this.baseUrl + "/Company/pagedCompanies?PageIndex=" + pageIndex + "&PageSize=" + pageSize + "&Sort=" + sort + "&Search=" + search);
  // }

  // allCompanies( sort: string, search: string) {
  //   return this.http.get<any>(this.baseUrl + "/Company/allCompamnies?Sort=" + sort + "&Search=" + search);
  // }

  // addOfficeLocation(location: OfficeLocationDto, id: number): Observable<any> {
  //   const formData = new FormData();

  //   formData.append('officeLocationName', location?.officeLocationName?.toString() ?? "");
  //   formData.append('color', location.color?.toString() ?? "");
  //   formData.append('addressLine1', location.addressLine1?.toString() ?? "");
  //   formData.append('addressLine2', location.addressLine2?.toString() ?? "");
  //   formData.append('city', location.city?.toString() ?? "");
  //   formData.append('zipCode', location.zipCode?.toString() ?? "0");
  //   formData.append('phoneNumber', location.phoneNumber?.toString() ?? "");
  //   formData.append('logoUrl', location.logoUrl?.toString() ?? "");
  //   formData.append('stateId', location.stateId?.toString() ?? "0");
  //   formData.append('timeZoneId', location.timeZoneId?.toString() ?? "0");

  //   if(id) {
  //     formData.append('id', id.toString());
  //     return this.http.put<any>(this.baseUrl + "/OfficeLocation/updateOfficeLocation", formData);
  //   } else {
  //     return this.http.post<any>(this.baseUrl + "/OfficeLocation/addOfficeLocation", formData);
  //   }
  // }

  // getOfficeLocationById(id: number) {
  //   return this.http.get<any>(this.baseUrl + "/OfficeLocation/getOfficeLocationById?id=" + id);
  // }

  // getPagedOfficeLocations (pageIndex: number, pageSize: number, OfficeLocationId: number, sort: string, search: string) {
  //   return this.http.get<any>(this.baseUrl + "/OfficeLocation/getPagedOfficeLocations?PageIndex=" + pageIndex + "&PageSize=" + pageSize + "&OfficeLocationId=" + OfficeLocationId + "&Sort=" + sort + "&Search=" + search);
  // }

  // allOfficeLocationIds(OfficeLocationId: number, sort: string, search: string) {
  //   return this.http.get<any>(this.baseUrl + "/OfficeLocation/allOfficeLocationIds?OfficeLocationId=" + OfficeLocationId + "&Sort=" + sort + "&Search=" + search);
  // }

  // officelocationsdropdown() {
  //   return this.http.get<any>(this.baseUrl + "/OfficeLocation/officelocationsdropdown");
  // }
}
