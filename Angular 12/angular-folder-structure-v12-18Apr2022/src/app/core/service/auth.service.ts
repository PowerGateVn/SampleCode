import { Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';

import { User } from '@data/schema/user';

interface LoginContextInterface {
  username: string;
  password: string;
  token: string;
}

const defaultUser = {
  username: 'admin',
  password: '12345',
  token: '12345'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  _hasLoggedIn: boolean = false;

  login(loginContext: LoginContextInterface): Observable<User> {
    const isDefaultUser =
      loginContext.username === defaultUser.username &&
      loginContext.password === defaultUser.password;

    if (isDefaultUser) {
      this._hasLoggedIn = true;
      this.token = defaultUser.token;
      return of(defaultUser);
    }

    return throwError('Invalid username or password');
  }

  logout(): Observable<boolean> {
    this.token = null;
    this._hasLoggedIn = false;
    return of(false);
  }
  hasLoggedIn() {
    return this.token && this._hasLoggedIn;
  }
}
