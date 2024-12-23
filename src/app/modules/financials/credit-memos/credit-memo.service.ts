import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditMemoDto } from './CreditMemoDto';
import { AppConfig } from 'src/app/core/app-config';

@Injectable({
  providedIn: 'root',
})
export class CreditMemoService {
  private apiUrl = `${AppConfig}/credit-memos`; // Update the API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all credit memos with pagination
  getAllCreditMemos(
    relatedValue: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?relatedValue=${relatedValue}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }

  // Add a new credit memo
  addCreditMemos(creditMemo: CreditMemoDto): Observable<CreditMemoDto[]> {
    return this.http.post<CreditMemoDto[]>(this.apiUrl, creditMemo);
  }

  // Update an existing credit memo
  updateCreditMemo(creditMemo: CreditMemoDto): Observable<CreditMemoDto[]> {
    return this.http.put<CreditMemoDto[]>(
      `${this.apiUrl}/${creditMemo.creditMemoNumber}`,
      creditMemo
    );
  }

  // Delete a credit memo
  deleteCreditMemo(creditMemoNumber: string): Observable<CreditMemoDto[]> {
    return this.http.delete<CreditMemoDto[]>(
      `${this.apiUrl}/${creditMemoNumber}`
    );
  }
}
