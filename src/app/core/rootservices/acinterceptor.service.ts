import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AcinterceptorService implements HttpInterceptor {

  constructor(private _loading: LoadingService, private router: Router, private accountService: AccountService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loading.setLoading(true, req.url);
    const token = this.accountService.getToken();
    let authRequest = req;
    if (token) {
      authRequest = req.clone({
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
      });
    }

    return next.handle(authRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.handleUnauthorized();
        }
        return throwError(error);
      }),
      finalize(() => {
        this._loading.setLoading(false, req.url);
      })
    );
  }

  private handleUnauthorized(): void {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}






