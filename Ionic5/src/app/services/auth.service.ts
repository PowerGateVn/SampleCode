import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { localstorageName } from '../constants/config';

import { environment } from '../../environments/environment';
import { ShareDataService } from './share-data.service';
import { AuthInfo } from '../auth';

import * as moment from 'moment';

(window as any).global = window;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': 'true'
  })
};
@Injectable()
export class AuthService {
  authInfoAccess: AuthInfo[];
  localStorageAuth: any;
  constructor(
    public router: Router, public httpClient: HttpClient,
    public shareDataService: ShareDataService,
  ) {
  }

  getAccessToken(value): Observable<AuthInfo> {
    const body = JSON.stringify(value);
    const url = `${environment.apiUrl}/oauth/token`;
    return this.httpClient.post<AuthInfo>(url, body, httpOptions).pipe(
      tap((authInfo: AuthInfo) => {
        this.setAuthInfo(authInfo);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  requestAccessToken(value): Observable<AuthInfo> {
    const body = JSON.stringify(value);
    const url = `${environment.apiUrl}/authorize-token`;
    return this.httpClient.post<AuthInfo>(url, body, httpOptions).pipe(
      tap((authInfo: AuthInfo) => {
        console.log(`authInfo: ${authInfo}`);
        this.setAuthInfo(authInfo);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  private setAuthInfo(authInfo): void {
    localStorage.setItem(localstorageName.authInfo, JSON.stringify(authInfo));
  }

  async logout(message: string = '') {
    // remove local storeage
    localStorage.removeItem(localstorageName.authInfo);
    this.shareDataService.resetAll();
  }

  public getAuthInfo(): AuthInfo {
    const checkAuthInfo = localStorage.getItem(localstorageName.authInfo);
    if (!checkAuthInfo) { return; }
    const localStorageAuth = JSON.parse(checkAuthInfo) as AuthInfo;
    return localStorageAuth;
  }

  public getToken() {
    const authInfo = this.getAuthInfo();
    const token = authInfo && authInfo.access_token ? authInfo.access_token : '';
    return token;
  }

  public getRefresh() {
    const authInfo = this.getAuthInfo() as AuthInfo;
    const token = authInfo && authInfo.refresh_token ? authInfo.refresh_token : '';
    return token;
  }

  handleRefreshToken() {
    const storage = this.getAuthInfo() as AuthInfo;
    if (!storage) { return; }
    const now = moment().utc();
    const expires = moment.unix(storage.created_at + storage.expires_in);
    const checkTimeOut = expires.diff(now, 's');
    console.log('checkTimeOut: ', checkTimeOut);
    return checkTimeOut;
  }
}
