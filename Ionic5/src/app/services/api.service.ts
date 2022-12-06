import { Injectable } from '@angular/core';
import { Observable, of, throwError, observable, zip } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ShareDataService } from './share-data.service';
import { } from './share-data.service';
import { User } from '../interfaces/user';
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
  loading: boolean;
  constructor(
    private http: HttpClient,
    public authorizeService: AuthService,
    private shareDataService: ShareDataService,
  ) { }

  getCurrentUser(): Observable<User> {
    const url = `${environment.apiUrl}/users/me`;
    return this.http.get<User>(url, httpOptions).pipe(
      tap((res) => {
        this.shareDataService.getInfoCurrentUser(res);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
  toggleBookmark(type, id) {
    if (!id || !type) { return; }
    // entity type : explorer_views, users, organization
    const body = {};
    const url = `${environment.apiUrl}/${type}/${id}/toggle_bookmark`;
    return this.http.put(url, body, httpOptions).pipe(
      tap((res: any) => {
        console.log('toggleBookmark', res);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
