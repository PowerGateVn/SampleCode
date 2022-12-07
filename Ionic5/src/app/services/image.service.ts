import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    private camera: Camera,
    ) {
  }

  getCameraOption(sourceType = this.camera.PictureSourceType.PHOTOLIBRARY) {
    const options: CameraOptions = {
      quality: 80,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      allowEdit: true
    };
    return options;
  }
  dataURItoBlob(dataURI, type = 'image/png') {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type });
    return blob;
  }
}
