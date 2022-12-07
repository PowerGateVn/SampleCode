import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(): boolean {
    if (this.authService.hasLoggedIn()){
      return true;
    } else {
      this.router.navigateByUrl("/auth/login");
      return false;
    }
  }
}
