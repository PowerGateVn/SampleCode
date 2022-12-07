import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Events } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router, ResolveEnd } from '@angular/router';
import { grantType, localstorageName } from '../constants/config';

import { environment } from '../../environments/environment';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';
import { AuthInfo } from '../interfaces/auth';
import { ShareDataService } from './share-data.service';
import { FirestoreService } from './firestore.service';
import { FireStoreStoreageService } from 'src/app/services/firestore-storage.service';
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
  constructor(public router: Router, public httpClient: HttpClient,
              public shareDataService: ShareDataService,
              public firestoreService: FirestoreService,
              public fireStoreStoreageService: FireStoreStoreageService,
              public events: Events) {
  }

  getAccessToken(value): Observable<AuthInfo> {
    const body = JSON.stringify(value);
    const url = `${environment.host}/oauth/token`;
    return this.httpClient.post<AuthInfo>(url, body, httpOptions).pipe(
      tap((authInfo: AuthInfo) => {
        console.log(`authInfo:`);
        console.log(authInfo);
        this.setAuthInfo(authInfo);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  requestAccessToken(value): Observable<AuthInfo> {
    const body = JSON.stringify(value);
    const url = `${environment.host}/authorize-token`;
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

  async logout() {
    // remove local storeage
    localStorage.removeItem(localstorageName.authInfo);
    this.shareDataService.resetAll();
    this.fireStoreStoreageService.resetAll();
    this.firestoreService.signOut().finally(() => {
      this.router.navigate(['/main-login']);
      this.events.publish('resetData');
      console.log('signOut ');
    });
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
    const timeNow = moment().local().valueOf();
    const expires = moment.unix(storage.created_at + (storage.expires_in * 1000)).utc();
    const checkTimeOut = expires.diff(timeNow);
    console.log('checkTimeOut: ', checkTimeOut);
    return checkTimeOut;
  }

  getRefreshtoken(): Observable<any> {
    const url = `${environment.host}/oauth/token`;
    const value = {
      grant_type: grantType.refreshToken,
      refresh_token: this.getRefresh(),
    };
    if (!value.refresh_token) {
      this.logout();
      return;
    }
    return this.httpClient.post<AuthInfo>(url, value, httpOptions).pipe(
      tap((authInfo) => {
        console.log(`authInfo: `, authInfo);
        this.setAuthInfo(authInfo);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  forgotPassword(email): Observable<any> {
    const url = `${environment.host}/email-magic-link`;
    const value = { email };
    return this.httpClient.post<any>(url, value, httpOptions).pipe(
      tap((res: any) => {
        console.log(`forgotPassword susscess: `, res);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
