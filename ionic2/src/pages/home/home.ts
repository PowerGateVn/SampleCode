import { LoadingScreenProvider } from './../../providers/loadingScreen';
import { ApiProvider } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, ModalController, InfiniteScroll } from 'ionic-angular';
import { sortBy } from "lodash";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  images = [];
  imageData = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public apiService: ApiProvider,
    public loading: LoadingScreenProvider) {
  }

  ionViewDidLoad() {
    this.getImages();
  }

  getImages() {
    this.loading.show();
    this.images = [];
    this.apiService.getImages().then(res => {
      this.imageData = res.data;
      this.imageData = sortBy(this.imageData, ['title']);

      for (var i = 0; i < 10; i++) {
        if (i === this.imageData.length) {
          break;
        }

        this.images.push(this.imageData[i]);
      }

      this.loading.hide();
    }).catch(err => {
      console.error(err);
      this.loading.hide();
    });
  }

  doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        for (var i = this.images.length; i < this.imageData.length; i++) {
          this.images.push(this.imageData[i]);
        }

        infiniteScroll.complete();

        if (this.imageData.length === this.images.length) {
          infiniteScroll.enable(false);
        }

        resolve();
      }, 500);
    })
  }

  openModalProduct(data) {
    let modal = this.modalCtrl.create('ProductDetailsPage', { productData: data });
    modal.present();
  }
}
