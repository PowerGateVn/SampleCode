import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CommonHttpInterceptor implements HttpInterceptor {
  constructor(private apiservice: ApiService, private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('Making an authorized request');
    let authorizationToken = req.headers.get('Authorization');
    if (!authorizationToken) {
      const idToken = this.authService.getToken();
      if (idToken) {
        authorizationToken = 'Bearer ' + idToken;
      }
    }
    if (authorizationToken) {
      const authReq = req.clone({
        setHeaders: { Authorization: authorizationToken }
      });
      req = authReq;
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // 401 handled in auth.interceptor
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
