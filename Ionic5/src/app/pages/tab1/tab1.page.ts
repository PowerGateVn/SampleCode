import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public router: Router,
    public translate: TranslateService,
    private shareData: ShareDataService
  ) {
  }
  logOut() {
    this.router.navigateByUrl('/login');
  }
  chooseLang(value) {
    console.log(value);
    this.shareData.setLanguage(value);
    this.translate.use(value);
  }
}
