import { Injectable } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert = null;
  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    public toastController: ToastController,
  ) {
  }

  goBack() {
    this.navCtrl.pop();
  }
  async showErrorWithoutHeader(header, errorMessage) {
    const alert = await this.alertController.create({
      header,
      message: `${errorMessage}`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  async showSuccess(message) {
    message = message.replace(/(\r\n|\n|\r)/gm, ' ');
    message = message.replace(/\s{2,}/g, ' ');
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'top',
      cssClass: 'alert-success'
    });
    toast.present();
  }
}
