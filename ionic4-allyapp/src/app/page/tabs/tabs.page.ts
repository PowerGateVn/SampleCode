import { Component, OnDestroy } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { ModalQuarterDateComponent } from '../../components/modal-quarter-date/modal-quarter-date.component';
import { ApiService } from '../../services/api.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { TokenFireBase } from 'src/app/interfaces/tokenfirebase';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { get } from 'lodash';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  dontNeedPrepareUserInfo = false;
  dateNow: any;
  monthDate: number;
  TokenFireBase: TokenFireBase[];
  userInfo: any;
  items: any;
  showSearchBar: any = false;

  constructor(
    public modalController: ModalController,
    private filestoreService: FirestoreService,
    private apiService: ApiService,
    public loadingService: LoadingService,
    private events: Events,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.initializeItems();
  }
  
  async initializeItems() {
    // await this.apiService.prepareUserInfo();
    console.log('tab');
    console.log(new Date());
    const isValid = await this.handleRefreshToken();
    if (!isValid) { return; }
    const dontNeedPrepareUserInfo = JSON.parse(this.route.snapshot.queryParamMap.get('dontNeedPrepareUserInfo'));
    if (dontNeedPrepareUserInfo) { return; }
    await this.apiService.prepareUserInfo();
  }
  async handleRefreshToken() {
    const checkExpriseToken = this.authService.handleRefreshToken();
    if (checkExpriseToken === undefined || checkExpriseToken <= 0) {
      this.gotoLogin();
      this.authService.logout();
      return false;
    }
    return true;
  }
  async gotoLogin() {
    this.router.navigate(['/main-login']);
  }

}
