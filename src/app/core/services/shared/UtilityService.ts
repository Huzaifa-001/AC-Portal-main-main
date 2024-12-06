import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { BaseResponse } from '../../interfaces/BaseResponse';
import { MatSnackBar } from '@angular/material/snack-bar';

interface QueryParams {
  [key: string]: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  delete<T>(
    id: number | null,
    route: string,
    qp: QueryParams = {},
    data?: any
  ): Observable<T> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    return this.http['delete'](
      `${route}${id??'' ? '/' + id : ''}${cfqu}`,
      data
    ) as Observable<T>;
  }

  post<T>(
    route: string,
    data: any,
    id: string | null,
    qp: QueryParams = {}
  ): Observable<BaseResponse<T>> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    return this.http.post(`${route}${id ? '?id=' + id : ''}${cfqu}`, data, {
      responseType: 'json',
    }) as Observable<BaseResponse<T>>;
  }

  put<T>(
    route: string,
    data: any,
    id: string | null,
    qp: QueryParams = {}
  ): Observable<BaseResponse<T>> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    return this.http['put'](`${route}${id ? '?id=' + id : ''}${cfqu}`, data, {
      responseType: 'json',
    }) as Observable<BaseResponse<T>>;
  }

  get<T>(
    route: string,
    id?: number | null,
    qp: QueryParams = {}
  ): Observable<T> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    return this.http['get'](`${route}${id ? '/' + id : ''}${cfqu}`, {
      responseType: 'json',
    }) as Observable<T>;
  }

  private correctFormatForQueryUrl(qp: QueryParams): string {
    if (_.isNull(qp) || _.isEmpty(qp)) {
      return '';
    }
    const qpAsStr = this.mapQueryParamsToUrl(qp);
    return qpAsStr.length === 0 ? '' : `?${qpAsStr.join('&')}`;
  }

  private mapQueryParamsToUrl(qp: QueryParams): Array<string> {
    return Object.keys(qp).map((key: string) => {
      return `${key}=${qp[key]}`;
    });
  }

  private isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response;
  }

  showSuccessSnackBar(
    message: string,
    actionBtnTxt: string = 'Close',
    verticalPosition: any = 'top'
  ) {
    this.snackBar.open(message, actionBtnTxt, {
      duration: 3000,
      verticalPosition: verticalPosition,
      panelClass: ['success-snackbar'],
    });
  }

  showErrorSnackBar(
    message: string,
    actionBtnTxt: string = 'Close',
    verticalPosition: any = 'top'
  ) {
    this.snackBar.open(message, actionBtnTxt, {
      duration: 3000,
      verticalPosition: verticalPosition,
      panelClass: ['error-snackbar'],
    });
  }
}
