import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: any = { name: '', phoneNumber: '' };
  submitted = false;
  loading: boolean;

  constructor(
    public router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    public translate: TranslateService
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;
    this.loading = true;
    if (form.valid) {
      this.router.navigateByUrl('/tabs/tab1');
      this.loading = false;
    }
  }
}
