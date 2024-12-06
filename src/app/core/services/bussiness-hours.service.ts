import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';import { BussinessHoursDto } from 'src/app/account/BussinessHoursDto';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root',
})
export class BussinessHoursService {
  constructor(private http: HttpClient) {}

  addBussinessHours(bHours: BussinessHoursDto, id?: number): Observable<any> {
    const formData = new FormData();
    formData.append('day', bHours?.day?.toString() ?? '');
    formData.append('officeStartTime', bHours.officeStartTime?.toString() ?? '');
    formData.append('breakStartTime', bHours.breakStartTime?.toString() ?? '');
    formData.append('breakEndTime', bHours.breakEndTime?.toString() ?? '');
    formData.append('officeEndTime', bHours.officeEndTime?.toString() ?? '');
    formData.append('officeLocationId', bHours.officeLocationId?.toString() ?? '0');

    if (id?.toString()) {
      formData.append('id', id.toString());
      const url = `${AppConfig.BussinessHours.Update}`;
      return this.http.put<any>(url, formData);
    } else {
      const url = `${AppConfig.BussinessHours.Add}`;
      return this.http.post<any>(url, formData);
    }
  }

  deleteBussinessHours(id: number): Observable<any> {
    const url = `${AppConfig.BussinessHours.Add}?Id=${id}`;
    return this.http.delete<any>(url);
  }

  getBussinessHoursById(id: number, officeLocationId: number): Observable<any> {
    const url = `${AppConfig.BussinessHours.Getbyid}?id=${id}&OfficeLocationId=${officeLocationId}`;
    return this.http.get<any>(url);
  }

  getPagedBussinessHours(pageIndex: number, pageSize: number, bussinessHoursId: number, sort: string, search: string): Observable<any> {
    const url = `${AppConfig.BussinessHours.Pagedbussinesshours}?PageIndex=${pageIndex}&PageSize=${pageSize}&BussinessHoursId=${bussinessHoursId}&Sort=${sort}&Search=${search}`;
    return this.http.get<any>(url);
  }

  allBussinessHours(officeLocationId: number, sort: string, search: string): Observable<any> {
    const url = `${AppConfig.BussinessHours.Allbussinesshours}?OfficeLocationId=${officeLocationId}&Sort=${sort}&Search=${search}`;
    return this.http.get<any>(url);
  }
}
