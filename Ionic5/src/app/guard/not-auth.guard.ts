import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { expiresLogin } from 'src/app/constants/config';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {

  }
  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return true;
    const checkExpriseToken = this.authService.handleRefreshToken();
    if (checkExpriseToken === undefined) {
      return true;
    }
    if (checkExpriseToken > 0) {
      this.tab();
      return false;
    }
  }
  tab() {
    this.router.navigate(['/tabs/tab1']);
  }
}
