import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {
  }
  logout() {
    this.authService.logout();
  }
  tab1() {
    this.router.navigate(['/tabs/tab1']);
  }
}
