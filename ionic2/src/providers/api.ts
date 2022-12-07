import { Headers, Http, ResponseContentType, URLSearchParams } from "@angular/http";
import { Injectable } from '@angular/core'
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";

import { AppConfig } from './../app/AppConfig';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(public http: Http) {
    console.log('Hello ApiProvider Provider')
  }

  getImages(): Promise<any> {
    return this.http.get(`assets/data/products.json`).toPromise()
      .then((res) => res.json())
      .catch(this.handleError);
  }

  getProductById(index): Promise<any> {
    return this.http.get(`assets/data/products.json`).toPromise()
      .then((res) => res.json())
      .catch(this.handleError);
  }

  handleError(error) {
    console.log("handleError", arguments);
    if (error.json() && error.json().message) {
      // sweetAlert({
      //     animation: false, title: this.t.instant("Error"),
      //     text: error.json().message
      // });
    }

    if (error.status == 401) {
      // this.events.publish('user:logout');
      return;
    }

    if (error.status !== 0) {
      throw error;
    }
  }
}
