import { Component, NgZone } from '@angular/core';
import { Router, RouterModule, Route } from '@angular/router';

import { Platform, NavController, Events, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as moment from 'moment';
import { AuthService } from './services/auth.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

import { TabsPage } from './page/tabs/tabs.page';
import { LoginPage } from './page/login/login.page';
import { ApiService } from './services/api.service';
import { deeplinkUrl, expiresLogin, localstorageName, grantType } from './constants/config';
import { AuthInfo } from './interfaces/auth';
import { environment } from 'src/environments/environment';
import { zip } from 'rxjs';
import { LoadingService } from './services/loading.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  AuthInfo: AuthInfo[];
  dataObjectiveCard: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    private events: Events,
    private router: Router,
    private ngZone: NgZone,
    public authService: AuthService,
    public apiService: ApiService,
    public loadingService: LoadingService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.handleDeeplink();
      // console.log('initializeApp component');
      // this.handleExpriseToken();
    });
  }
  async processWhenAppReady() {
    this.platform.ready().then(async () => {
      this.splashScreen.hide();
      console.log('processWhenAppReady');
    });
  }
  async gotoHomePage() {
    // this.loadingService.showLoading();
    // await this.apiService.prepareUserInfo();
    this.router.navigate(['/tabs']);
    // this.loadingService.hideLoading();
    // console.log('gotoHomePage end');
  }
  async gotoLogin() {
    this.router.navigate(['/main-login']);
    // console.log('gotoLogin end');
  }
  handleDeeplink() {
    // <scheme>://<host>/magic-link/<token>
    // url allyapp://sandbox.gotoally.com/magic-link?token=c318c1782130c97db81381bfb17466f6d4611e94a04b2aa19137e537f000ee6b
    if (typeof cordova === 'undefined') {
      this.processWhenAppReady();
      return;
    }
    const magicLinkToken = `${deeplinkUrl.magicLink}/:token`;
    console.log('magicLinkToken');
    console.log(magicLinkToken);
    this.deeplinks.route({
      '': LoginPage,
      '/magic-link': TabsPage,
      '/magic-link/:token': TabsPage,
    })
      .subscribe((match) => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        this.ngZone.run(async () => {
          this.processWhenAppReady();
          // alert('Successfully matched route2: ' + JSON.stringify(match));
          console.log('Successfully matched route');
          console.log([match.$args, match.$link]);
          // if (match.$link.host !== deeplinkUrl.magicLink) {
          //   return;
          // }
          if (!match.$args.token) {
            this.router.navigate(['/main-login']);
            return;
          }
          // this.router.navigate([match.$link.host]);
          const value = {
            token: match.$args.token
          };
          this.loadingService.showLoading();
          await this.authService.requestAccessToken(value)
            .subscribe(async (res: any) => {
              await this.apiService.prepareUserInfo();
              this.router.navigate(['/tabs/tab1'], { queryParams: { dontNeedPrepareUserInfo: true } });
              console.log('gotoHomePage');
              this.loadingService.hideLoading();
            }, err => {
              this.router.navigate(['/main-login']);
              this.loadingService.hideLoading();
            });
        });
      },
        (nomatch) => {
          // alert('Got a deeplink that didn\'t match' + JSON.stringify(nomatch));
          // nomatch.$link - the full link data
          console.error('Got a deeplink that didn\'t match', nomatch);
          this.processWhenAppReady();
        });
  }
  // async handleExpriseToken() {
  //   const checkExpriseToken = this.authService.handleRefreshToken();
  //   if (checkExpriseToken === undefined) {
  //     // this.gotoLogin();
  //     this.authService.logout();
  //     return;
  //   }
  //   if (checkExpriseToken > expiresLogin.default) {
  //     await this.gotoHomePage();
  //   } else {
  //     this.authService.getRefreshtoken().subscribe(async (res: any) => {
  //       await this.gotoHomePage();
  //     });
  //   }
  // }
}
