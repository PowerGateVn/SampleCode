import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ShareDataService } from './services/share-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  dir: string = 'rtl';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService,
    private shareData: ShareDataService

  ) {
    this.initializeApp();
    this.handerBehaviorSubject();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translate.addLangs(['en', 'ar']);
      this.translate.setDefaultLang('ar');
      this.translate.use('ar');
    });
  }
  handerBehaviorSubject() {
    this.shareData.language.subscribe((language) => {
      this.dir = language == 'ar' ? 'rtl' : 'ltr';
    });
  }
}
