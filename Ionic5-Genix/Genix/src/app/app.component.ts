import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormioAuthService } from 'angular-formio/auth';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    userData = null;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        public menuCtrl: MenuController,
        public router: Router,
        private authService: FormioAuthService
    ) {
        this.initializeApp();
        console.log(this.authService);
        this.authService.onLogout.subscribe(() => {
            this.router.navigate(['/login']);
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    onClick() {
        this.menuCtrl.close();
    }
}
