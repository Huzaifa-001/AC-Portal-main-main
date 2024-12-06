import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app-config';
import { CreateOfficeLocationDTO } from 'src/app/modules/location/DTOs/CreateOfficeLocationDTO';
import { UpdateOfficeLocationDTO } from 'src/app/modules/location/DTOs/UpdateOfficeLocationDTO';
import { PagedOfficeLocationsDTO } from 'src/app/modules/location/DTOs/PagedOfficeLocationsDTO';

@Injectable({
  providedIn: 'root'
})
export class OfficeLocationService {
  private apiUrl = AppConfig.Base_url;

  constructor(private http: HttpClient) {}

  getDropdownOptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/OfficeLocation/officelocationsdropdown`);
  }

  createOfficeLocation(dto: CreateOfficeLocationDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/OfficeLocation/addOfficeLocation`, dto);
  }

  updateOfficeLocation(dto: UpdateOfficeLocationDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/OfficeLocation/updateOfficeLocation`, dto);
  }

  getOfficeLocationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/OfficeLocation/getOfficeLocationById?id=${id}`);
  }

  getPagedOfficeLocations(dto: PagedOfficeLocationsDTO): Observable<any> {
    const queryParams = new HttpParams({ fromObject: dto as any });
    return this.http.get(`${this.apiUrl}/OfficeLocation/PagedOfficeLocations`, { params: queryParams });
  }

  getAllOfficeLocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/OfficeLocation/allOfficeLocations`);
  }
  getStates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/States`);
  }
  getTimeZones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/TimeZone`);
  }

  // Implement other methods as needed
}


