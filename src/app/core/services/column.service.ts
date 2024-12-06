import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTOColumnInsert, DTOColumns } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  private baseUrl = 'YOUR_API_BASE_URL/api/Columns';

  constructor(private http: HttpClient) {}

  getColumnsById(id: number): Observable<any> {
    const url = `${this.baseUrl}/GetColumnsById?Id=${id}`;
    return this.http.get(url);
  }

  getAllColumns(): Observable<any> {
    const url = `${this.baseUrl}/GetAllColumns`;
    return this.http.get(url);
  }

  createColumns(columns: DTOColumnInsert): Observable<any> {
    const url = `${this.baseUrl}/CreateColumns`;
    return this.http.post(url, columns);
  }

  updateColumns(columns: DTOColumns): Observable<any> {
    const url = `${this.baseUrl}/UpdateColumns`;
    return this.http.post(url, columns);
  }

  deleteColumns(columns: DTOColumns): Observable<any> {
    const url = `${this.baseUrl}/DeleteColumns`;
    return this.http.post(url, columns);
  }
}
