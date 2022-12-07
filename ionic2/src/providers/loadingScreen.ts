import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingScreenProvider {
  loading: any;
  constructor(public loadingCtrl: LoadingController) {
    // this.loading = this.loadingCtrl.create({
    //     spinner: 'crescent',
    //     showBackdrop : false

    // });
  }
  show() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: false

    });
    this.loading.present();
  }

  hide() {
    this.loading && this.loading.dismiss();
  }
}
