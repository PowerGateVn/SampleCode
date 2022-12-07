import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
/*
  Generated class for the LoadingService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingService {
  loading: any;
  constructor(public loadingCtrl: LoadingController) {
  }
  async showLoading() {
    // if (this.loading) {
    //   return;
    // }
    if (!this.loading) {
      this.loading = await this.loadingCtrl.create({
        showBackdrop: false
      });
    }
    return this.loading.present();
  }
  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
