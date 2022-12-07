import { Component } from '@angular/core';
import { FormioAppConfig } from 'angular-formio';
import { Router } from '@angular/router';
import { FormioAuthService } from 'angular-formio/auth';

@Component({
    selector: 'app-home',
    templateUrl: 'login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {
    constructor(public config: FormioAppConfig, private router: Router, public auth: FormioAuthService) {
        this.auth.onLogin.subscribe(() => {
            this.router.navigate(['/']);
        });
    }
}
