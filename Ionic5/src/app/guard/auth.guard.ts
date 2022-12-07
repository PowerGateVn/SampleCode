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
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {

  }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<any> {
      const checkExpriseToken = this.authService.handleRefreshToken();
      console.log('checkExpriseToken auth.guard', checkExpriseToken);
      return true;
      if (checkExpriseToken === undefined) {
        this.login();
        return false;
      }
      return true;
  }
  login() {
    this.router.navigate(['/login']);
  }
}
