import { LoadingScreenProvider } from './../../providers/loadingScreen';
import { ApiProvider } from './../../providers/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  productDetail: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public apiService: ApiProvider,
    public loading: LoadingScreenProvider,
  ) {
    this.productDetail = navParams.data.productData;


  }
  ionViewDidLoad() {

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
