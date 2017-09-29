import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()

/* 
 * If user was login,
 * href to /login will be redirect to /status
 */

export class AuthAccountGuard implements CanActivate {
  
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('adminUser')) {
      // logged in so return true
      this.router.navigate(['/status']);
      return false;
    } else {
      // not logged in so redirect to login page with the return url
      return true;
    }
  }
}
