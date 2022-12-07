import { Injectable } from '@angular/core';
import { Observable, of, throwError, observable, zip } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { User } from 'firebase';
import { dbType, localstorageName } from '../constants/config';
import { TokenFireBase } from '../interfaces/tokenfirebase';
import { ShareDataService } from './share-data.service';
import {  } from './share-data.service';
import { FirestoreService } from './firestore.service';
import { LoadingService } from './loading.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': 'true'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient,
              public authorizeService: AuthService,
              private shareDataService: ShareDataService,
              private firestoreService: FirestoreService,
              private loadingService: LoadingService) { }

  updateProduct(id, product): Observable<any> {
    const url = `${environment.baseUrl}/${id}`;
    return this.http.put(url, product, httpOptions).pipe(
      tap(_ => console.log(`updated product id=${id}`)),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getCurrentUser(): Observable<User> {
      const url = `${environment.baseUrl}/users/me`;
      return this.http.get<User>(url, httpOptions).pipe(
        tap((res) => {
          // console.log(`user info: `, res);
          this.shareDataService.getInfoCurrentUser(res);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  getTokenFireStore(): Observable<TokenFireBase> {
    const url = `${environment.baseUrl}/users/token?type=${dbType.firestore}`;
    return this.http.get<TokenFireBase>(url, httpOptions).pipe(
      tap((res) => {
        this.shareDataService.getFirebaseToken(res.token);
        // console.log(`token firestore: `, res.token);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  prepareUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      const getFirebaseToken = this.getTokenFireStore();
      const getUserInfo = this.getCurrentUser();
      zip(getFirebaseToken, getUserInfo).subscribe(
        async (res) => {
        // let firebaeToken = res[0];
        // let userInfo = res[1];
        console.log('getFirebaseToken and getUserInfo');
        // console.log(res);
        console.log(new Date());
        resolve(this.firestoreService.initFireStore(res[0].token, res[1]));
      }, err => {
        this.loadingService.hideLoading();
      });
    });
  }
}
