import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { FormioAuthService } from 'angular-formio/auth';

@Injectable()
class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: FormioAuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    // auto logout if 401 response returned from api
                    this.authenticationService.logout();
                }

                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }
}

export const HttpErrorInterceptProviders = [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }];
