import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  baseUrl = AppConfig.Base_url;

  constructor(private http: HttpClient) { }

  // Get all fields by entity type
  getFieldsByEntityType(entityType: string): Observable<any> {
    const url = `${AppConfig.DynamicFields.GetAllByEntityType(entityType)}`;
    return this.http.get<any>(url);
  }

  // Get a specific field by ID
  getFieldById(id: string): Observable<any> {
    const url = `${AppConfig.DynamicFields.GetById(id)}`;
    return this.http.get<any>(url);
  }

  // Create a new field
  createField(fieldData: any): Observable<any> {
    return this.http.post<any>(AppConfig.DynamicFields.Create, fieldData);
  }

  // Update an existing field
  updateField(fieldData: any): Observable<any> {
    return this.http.put<any>(AppConfig.DynamicFields.Update, fieldData);
  }

  // Delete a field by ID
  deleteField(id: string): Observable<any> {
    const url = `${AppConfig.DynamicFields.Delete(id)}`;
    return this.http.delete<any>(url);
  }
}
