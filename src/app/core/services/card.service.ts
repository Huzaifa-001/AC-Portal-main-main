import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DTOProject } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private baseUrl = 'YOUR_API_BASE_URL';

  constructor(private http: HttpClient) {}

  getCardById(id: number): Observable<any> {
    const url = `${this.baseUrl}/GetCardById?Id=${id}`;
    return this.http.get(url);
  }

  getAllCards(): Observable<any> {
    const url = `${this.baseUrl}/GetAllCard`;
    return this.http.get(url);
  }

  createCard(name: string, color: string, cardStatus: string): Observable<any> {
    const url = `${this.baseUrl}/CreateCard`;
    const body = { Name: name, Color: color, CardStatus: cardStatus };
    return this.http.post(url, body);
  }

  updateCard(card: DTOProject): Observable<any> {
    const url = `${this.baseUrl}/UpdateCard`;
    return this.http.post(url, card);
  }

  deleteCard(card: DTOProject): Observable<any> {
    const url = `${this.baseUrl}/DeleteCard`;
    return this.http.post(url, card);
  }
}
