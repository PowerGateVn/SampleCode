import { Injectable } from '@angular/core';
// import { Upload } from './upload';
import * as firebase from 'firebase';

@Injectable()
export class UploadService {

  constructor() {

  }

  insertData(file) {
    return firebase.storage().ref('uploads/' + file.name).put(file);
  }



}
